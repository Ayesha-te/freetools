import type { ToolContent } from "./types";

const localPdf =
  "Your PDF is opened and processed inside your browser with the open-source pdf-lib and PDF.js libraries. It is never uploaded to FreeTools Hub or any third party, which makes the tool suitable for confidential documents.";

export const pdfContent: Record<string, ToolContent> = {
  "pdf-merger": {
    intro: [
      "PDF Merger combines two or more PDF files into a single document. You control the order of the files, and every page is copied with its original text, fonts and images intact.",
      "The merge runs locally, so even large confidential documents never leave your computer.",
    ],
    why: [
      "Combining a cover letter, CV and certificates into one attachment makes applications easier to review. Accountants often need monthly statements combined into one file, and teachers may want separate worksheets bundled into a single handout.",
      "Unlike printing to PDF, merging keeps text selectable and searchable and does not reduce quality.",
    ],
    steps: [
      "Click “choose PDF files” or drag several PDFs onto the upload area. You can add more files at any time.",
      "Arrange the order with the up and down arrows. Files are merged from top to bottom.",
      "Remove any file you do not need with the × button.",
      "Click “Merge PDFs” and wait for the progress bar to finish.",
      "Download the merged document.",
    ],
    examples: [
      { title: "Job application pack", body: "Add cover-letter.pdf, cv.pdf and degree-certificate.pdf, order them in that sequence, and download a single merged.pdf to attach to an online application." },
      { title: "Quarterly statements", body: "Merge three monthly bank statements into one file in chronological order for a loan application." },
    ],
    formats: ["Input: standard PDF files up to 100 MB each, up to 50 files and 300 MB in total.", "Output: a single PDF file."],
    limitations: [
      "Password-protected or encrypted PDFs cannot be merged until the protection is removed in a PDF reader you trust.",
      "Interactive form fields and bookmarks/outlines from the source files may not be preserved.",
      "Very large merges depend on available memory; on phones, merge in smaller batches.",
    ],
    privacy: localPdf,
    faq: [
      { q: "Is there a page limit?", a: "There is no fixed page limit. The practical limit is your device's memory; most computers handle several hundred pages comfortably." },
      { q: "Will the merged file be larger than the originals combined?", a: "It is usually close to the sum of the inputs, sometimes slightly smaller because the file structure is rebuilt with compressed object streams." },
      { q: "Can I merge only certain pages from a file?", a: "Extract the pages you need with the PDF Page Extractor first, then merge the extracted file." },
    ],
    related: ["pdf-splitter", "pdf-page-extractor", "image-to-pdf", "pdf-compressor"],
  },

  "pdf-splitter": {
    intro: [
      "PDF Splitter breaks one PDF into several smaller files. Split every page into its own file, split into equal chunks (for example every 5 pages), or define custom ranges where each range becomes a separate PDF.",
      "All parts can be downloaded individually or together as a ZIP archive.",
    ],
    why: [
      "Large scanned documents often contain several unrelated items. Splitting lets you send only the relevant section, file each part separately, or upload documents to portals that enforce per-file size limits.",
    ],
    steps: [
      "Choose a PDF. The page count appears next to the file name.",
      "Pick a split mode: Every page, Every N pages, or Custom ranges.",
      "For custom ranges, type groups separated by commas — for example 1-3, 4-10, 11- — where “11-” means page 11 to the end.",
      "Click “Split PDF”.",
      "Download each part, or click “Download all as ZIP”.",
    ],
    examples: [
      { title: "Separating scanned invoices", body: "A 12-page scan containing four 3-page invoices can be split with “Every N pages” set to 3, producing four files." },
      { title: "Chapters of a report", body: "Enter 1-4, 5-18, 19-30 to create separate files for the introduction, main body and appendix." },
    ],
    formats: ["Input: one PDF up to 100 MB.", "Output: multiple PDF files, or a ZIP containing them (maximum 500 parts)."],
    limitations: [
      "Each part contains a copy of the fonts and images its pages need, so the parts together can be larger than the original.",
      "Encrypted PDFs must be unlocked first.",
    ],
    privacy: localPdf,
    faq: [
      { q: "What is the difference between splitting and extracting?", a: "Splitting creates several output files covering the document. Extracting creates one new file containing only the pages you select." },
      { q: "Can ranges overlap?", a: "Yes. Each range is processed independently, so 1-5, 3-8 creates two files that both include pages 3–5." },
      { q: "Is the original file modified?", a: "No. New files are created in memory; your original PDF stays exactly as it was." },
    ],
    related: ["pdf-page-extractor", "pdf-merger", "pdf-page-rotator", "pdf-to-image"],
  },

  "pdf-page-extractor": {
    intro: [
      "PDF Page Extractor creates a new PDF that contains only the pages you choose. Click page thumbnails or type ranges such as 1-3, 7, 10-12, and the selected pages are saved in document order.",
      "It is effectively also a way to delete pages: select everything except the pages you want to remove.",
    ],
    why: [
      "You might need to send one signed page from a long contract, submit only the relevant pages of a statement, or remove blank pages produced by a scanner. Extracting keeps the original quality and selectable text.",
    ],
    steps: [
      "Choose a PDF. Thumbnails of the first 60 pages are generated on your device.",
      "Click thumbnails to select or deselect pages, or type page numbers and ranges in the text box.",
      "Check the count on the “Extract” button.",
      "Click “Extract” and download the new PDF.",
    ],
    examples: [
      { title: "Removing blank pages", body: "A 20-page scan has blank pages 4 and 15. Enter 1-3, 5-14, 16-20 to save a clean 18-page copy." },
      { title: "Sharing a single signed page", body: "Select only page 9 of a contract to send just the signature page to a colleague." },
    ],
    formats: ["Input: one PDF up to 100 MB.", "Output: one PDF containing the selected pages.", "Range syntax: single pages (5), ranges (2-6), open-ended (8-) separated by commas."],
    limitations: [
      "Pages are always saved in their original document order. To reorder pages, extract separate parts and merge them in the order you want.",
      "Thumbnails are limited to the first 60 pages to save memory, but any page number can be typed.",
    ],
    privacy: localPdf,
    faq: [
      { q: "Can I change the page order?", a: "Not in this tool. Extract each section separately and arrange them in the PDF Merger." },
      { q: "What happens if I type a page that does not exist?", a: "You get a clear error stating how many pages the document has, and nothing is created." },
      { q: "Does extracting reduce quality?", a: "No. Pages are copied as-is, including vector text and original images." },
    ],
    related: ["pdf-splitter", "pdf-merger", "pdf-page-rotator", "pdf-compressor"],
  },

  "image-to-pdf": {
    intro: [
      "Image to PDF turns one or more images into a PDF document, one image per page. Choose A4, US Letter or pages that match each image's size, set margins and orientation, and arrange the order before saving.",
      "It is a quick way to turn phone photos of documents, receipts or handwritten notes into a single file that is easy to share or submit.",
    ],
    why: [
      "Many portals accept only PDF uploads. Combining multiple photos into one PDF also keeps related pages together and in order, which is much clearer for the recipient than several loose image files.",
    ],
    steps: [
      "Add images by dragging them in or clicking “choose images”. You can add up to 100.",
      "Use the arrows to reorder pages and × to remove any image.",
      "Choose the page size, orientation and margin.",
      "Click “Create PDF” and download the result.",
    ],
    examples: [
      { title: "Submitting handwritten homework", body: "Photograph each page, add the photos in order, choose A4 with a 10 mm margin and Automatic orientation, then upload the single PDF to your school's portal." },
      { title: "Expense receipts", body: "Combine six receipt photos into one PDF with “Fit to image” page size so each page is exactly as large as its receipt." },
    ],
    formats: ["Input: JPG, PNG, WebP, GIF and BMP up to 40 MB each.", "Output: PDF with A4, Letter or fit-to-image pages.", "Margins: 0–50 mm."],
    limitations: [
      "Text in photos is not recognised (no OCR), so the PDF is not searchable.",
      "Large, high-resolution photos create large PDFs. Run them through the Image Compressor first if you need a small file.",
      "Images are scaled to fit the page while keeping their proportions; they are never stretched or cropped.",
    ],
    privacy: localPdf,
    faq: [
      { q: "How do I make the PDF smaller?", a: "Compress or resize the images before converting. A 1600-pixel-wide photo is sharp enough for an A4 page on screen." },
      { q: "What does Automatic orientation do?", a: "Each page becomes landscape if its image is wider than it is tall, and portrait otherwise." },
      { q: "Are photos rotated correctly?", a: "Yes. JPG photos are redrawn by the browser, which applies the camera's orientation information." },
    ],
    related: ["pdf-merger", "image-compressor", "pdf-to-image", "pdf-compressor"],
  },

  "pdf-page-rotator": {
    intro: [
      "PDF Page Rotator fixes pages that appear sideways or upside down. Rotate every page at once or turn individual pages by 90° steps while watching live thumbnails.",
      "Rotation is stored as a page setting, so text remains sharp and selectable and the file size barely changes.",
    ],
    why: [
      "Scanners and phone apps frequently save some pages in the wrong orientation, especially landscape tables inside portrait documents. Fixing the file means every reader opens it the right way up without manual rotation.",
    ],
    steps: [
      "Choose a PDF; thumbnails appear for each page.",
      "Use “All pages” buttons to rotate the whole document, or the arrow buttons under individual pages.",
      "Check the thumbnails, then click “Apply rotation”.",
      "Download the corrected PDF.",
    ],
    examples: [
      { title: "A landscape table in a report", body: "Page 7 of a report is a wide table shown sideways. Click the right-rotate button below page 7 once and apply." },
      { title: "An upside-down scan", body: "If every page was scanned upside down, click the 180° button under “All pages”." },
    ],
    formats: ["Input: one PDF up to 100 MB.", "Output: the same PDF with updated page rotation."],
    limitations: [
      "Rotation is in 90° steps only; slightly skewed scans cannot be straightened.",
      "Encrypted PDFs must be unlocked first.",
      "Thumbnails are generated for the first 60 pages.",
    ],
    privacy: localPdf,
    faq: [
      { q: "Does rotating reduce quality?", a: "No. Only the page's rotation attribute changes; content is not re-rendered." },
      { q: "Can I undo a rotation?", a: "Before saving, use Reset or rotate back. After downloading, open the new file and rotate again. Your original file is never modified." },
      { q: "Why does the page look correct in one viewer but not another?", a: "Some viewers remember a temporary view rotation that is not saved in the file. Rotating here writes the change into the PDF itself, so every reader, printer and upload portal sees the same orientation." },
      { q: "Will rotated pages print correctly?", a: "Yes. Printers and print dialogs respect the saved page rotation. Landscape pages may be printed on a landscape-oriented sheet or scaled to fit, depending on your print settings." },
    ],
    related: ["pdf-page-extractor", "pdf-splitter", "pdf-merger", "pdf-to-image"],
  },

  "pdf-to-image": {
    intro: [
      "PDF to Image renders PDF pages as JPG or PNG pictures. Choose the pages, the resolution (72 to 300 DPI) and the image format, then download single images or a ZIP of all pages.",
      "Rendering uses Mozilla's PDF.js engine — the same engine that displays PDFs in Firefox.",
    ],
    why: [
      "Images are easier to insert into presentations, social posts and messaging apps than PDFs. A page image is also handy for previews and thumbnails on a website.",
    ],
    steps: [
      "Choose a PDF. All pages are selected by default.",
      "Optionally narrow the page range, for example 1-3, 5.",
      "Pick a resolution: 150 DPI for screens, 300 DPI for printing.",
      "Pick JPG for smaller files or PNG for crisp text and graphics.",
      "Click Convert and download images individually or as a ZIP.",
    ],
    examples: [
      { title: "Slide for a presentation", body: "Convert page 4 of a report at 200 DPI as PNG and paste the chart into your slides." },
      { title: "Sharing a flyer on social media", body: "Render a one-page PDF flyer at 150 DPI as JPG to post it as a normal image." },
    ],
    formats: ["Input: one PDF up to 100 MB.", "Output: JPG or PNG, up to 200 pages per run, individually or as a ZIP."],
    limitations: [
      "300 DPI images of many pages require a lot of memory; on phones, convert fewer pages at a time.",
      "Unusual fonts that are not embedded in the PDF may render with a substitute font.",
      "Text in the images is no longer selectable.",
    ],
    privacy: localPdf,
    faq: [
      { q: "Which resolution should I choose?", a: "150 DPI for viewing on screen, 200 DPI for sharp zooming, 300 DPI when you will print the image." },
      { q: "JPG or PNG?", a: "PNG keeps text and line art perfectly crisp but files are larger. JPG is best for pages with photos." },
      { q: "Why are some pages blank or missing elements?", a: "A small number of PDFs use features PDF.js cannot render. Try opening the file in another reader to confirm." },
    ],
    related: ["image-to-pdf", "pdf-page-extractor", "image-compressor", "pdf-compressor"],
  },

  "pdf-compressor": {
    intro: [
      "PDF Compressor offers two honest ways to reduce PDF size. Lossless cleanup rebuilds the file's internal structure without changing content. Image-based compression renders each page as a JPEG at a resolution you choose, which can dramatically shrink scans but makes text unselectable.",
      "The result always shows the real before-and-after size. If a file cannot be made smaller, the tool tells you and recommends keeping the original.",
    ],
    why: [
      "Email providers, university portals and government websites often cap uploads at 2–10 MB. Scanned documents can easily exceed this. Choosing the right method lets you meet the limit while understanding exactly what you trade away.",
    ],
    steps: [
      "Choose a PDF.",
      "Start with “Lossless cleanup” if the PDF contains real text you want to keep selectable.",
      "If the file is a scan or still too big, switch to “Image-based” and choose Light, Medium or Strong.",
      "Click “Compress PDF” and review the reported size change.",
      "Download only if the result meets your needs; otherwise keep the original.",
    ],
    examples: [
      { title: "Phone-scanned contract", body: "A 15-page scan saved at high resolution might be 28 MB. Image-based Medium compression commonly brings this into the 2–5 MB range while staying readable." },
      { title: "Text-only report", body: "A 400 KB report exported from a word processor is already efficient. Lossless cleanup may save a few percent, and image-based compression would likely make it bigger — the tool will show this." },
    ],
    formats: ["Input: one PDF up to 100 MB; image-based mode up to 300 pages.", "Output: PDF."],
    limitations: [
      "We do not advertise a fixed compression percentage, because results depend entirely on the file's contents.",
      "Image-based mode removes selectable text, links, bookmarks and form fields.",
      "Lossless mode cannot recompress images already embedded in the PDF; dedicated desktop software such as Ghostscript can do this more effectively.",
    ],
    privacy: localPdf,
    faq: [
      { q: "Why did my PDF get bigger?", a: "Text-based PDFs store letters as compact vector data. Turning them into images adds data. Use lossless mode or keep the original." },
      { q: "Which strength should I use for scans?", a: "Start with Medium (110 DPI). Use Light if small print becomes hard to read, Strong if you need the smallest possible file." },
      { q: "Is the compressed PDF still printable?", a: "Yes. Light setting (150 DPI) prints acceptably on standard printers; Strong is better suited to on-screen reading." },
    ],
    related: ["image-to-pdf", "pdf-splitter", "pdf-merger", "image-compressor"],
  },
};
