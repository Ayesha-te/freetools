import type { ToolContent } from "./types";
import { imageContent } from "./image";
import { pdfContent } from "./pdf";
import { studentContent } from "./student";
import { businessContent } from "./business";
import { developerContent } from "./developer";
import { textContent } from "./text";
import { extraFaq } from "./extra";

const base: Record<string, ToolContent> = {
  ...imageContent,
  ...pdfContent,
  ...studentContent,
  ...businessContent,
  ...developerContent,
  ...textContent,
};

export const content: Record<string, ToolContent> = Object.fromEntries(
  Object.entries(base).map(([slug, c]) => [slug, { ...c, faq: [...c.faq, ...(extraFaq[slug] ?? [])] }]),
);
