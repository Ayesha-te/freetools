"use client";

import type { PDFDocument } from "pdf-lib";

export const MAX_PDF_BYTES = 100 * 1024 * 1024;

export async function validatePdf(f: File): Promise<string | null> {
  const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
  if (!isPdf) return `"${f.name}" is not a PDF file.`;
  if (f.size === 0) return `"${f.name}" is empty.`;
  if (f.size > MAX_PDF_BYTES) return `"${f.name}" is larger than 100 MB, which is too large to process reliably in a browser.`;
  const head = new Uint8Array(await f.slice(0, 1024).arrayBuffer());
  const text = new TextDecoder("latin1").decode(head);
  if (!text.includes("%PDF-")) return `"${f.name}" does not look like a valid PDF (missing PDF header).`;
  return null;
}

export async function loadPdfLib() {
  return import("pdf-lib");
}

/** Load a PDF with pdf-lib and translate common failures into friendly messages. */
export async function openPdf(file: File): Promise<PDFDocument> {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (e) {
    const msg = String((e as Error).message || e);
    if (/encrypt/i.test(msg)) throw new Error(`"${file.name}" is password-protected or encrypted. Remove the protection in a PDF reader first.`);
    throw new Error(`"${file.name}" could not be read. It may be damaged or use unsupported features.`);
  }
}

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
export function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((m) => {
      m.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return m;
    });
  }
  return pdfjsPromise;
}

export async function openPdfJs(data: ArrayBuffer) {
  const pdfjs = await loadPdfJs();
  try {
    return await pdfjs.getDocument({ data: new Uint8Array(data), isEvalSupported: false }).promise;
  } catch (e) {
    const name = (e as { name?: string }).name;
    if (name === "PasswordException") throw new Error("This PDF is password-protected. Remove the password in a PDF reader first.");
    throw new Error("This PDF could not be read. It may be damaged.");
  }
}

type PdfJsDoc = Awaited<ReturnType<typeof openPdfJs>>;

/** Render one page to a canvas at a given scale (1 = 72 dpi). */
export async function renderPage(doc: PdfJsDoc, pageNumber: number, scale: number, rotation = 0) {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale, rotation: (page.rotate + rotation) % 360 });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  page.cleanup();
  return canvas;
}

/** Render small thumbnails as data URLs for page previews. */
export async function thumbnails(data: ArrayBuffer, maxPages = 60, width = 140): Promise<string[]> {
  const doc = await openPdfJs(data);
  const out: string[] = [];
  const n = Math.min(doc.numPages, maxPages);
  for (let i = 1; i <= n; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const c = await renderPage(doc, i, width / vp.width);
    out.push(c.toDataURL("image/jpeg", 0.7));
  }
  await doc.destroy();
  return out;
}

export async function savePdf(doc: PDFDocument) {
  const bytes = await doc.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
