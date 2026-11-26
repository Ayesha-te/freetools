"use client";

import dynamic from "next/dynamic";
import { useEffect, type ComponentType } from "react";
import { pushRecent } from "@/lib/storage";
import { track } from "@/lib/analytics";

export interface ToolProps {
  slug: string;
}

const Loading = () => (
  <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border bg-surface text-sm text-muted" aria-busy="true">
    Loading tool…
  </div>
);

const registry: Record<string, ComponentType<ToolProps>> = {
  "image-compressor": dynamic(() => import("./image/ImageCompressor"), { loading: Loading }),
  "compress-image-to-50kb": dynamic(() => import("./image/ImageCompressor"), { loading: Loading }),
  "compress-image-to-100kb": dynamic(() => import("./image/ImageCompressor"), { loading: Loading }),
  "compress-image-to-20kb": dynamic(() => import("./image/ImageCompressor"), { loading: Loading }),
  "compress-image-to-30kb": dynamic(() => import("./image/ImageCompressor"), { loading: Loading }),
  "compress-image-to-200kb": dynamic(() => import("./image/ImageCompressor"), { loading: Loading }),
  "image-resizer": dynamic(() => import("./image/ImageResizer"), { loading: Loading }),
  "jpg-to-png": dynamic(() => import("./image/ImageConverter"), { loading: Loading }),
  "png-to-jpg": dynamic(() => import("./image/ImageConverter"), { loading: Loading }),
  "image-cropper": dynamic(() => import("./image/ImageCropper"), { loading: Loading }),
  "pdf-merger": dynamic(() => import("./pdf/PdfMerger"), { loading: Loading }),
  "pdf-splitter": dynamic(() => import("./pdf/PdfSplitter"), { loading: Loading }),
  "pdf-page-extractor": dynamic(() => import("./pdf/PdfExtractor"), { loading: Loading }),
  "image-to-pdf": dynamic(() => import("./pdf/ImageToPdf"), { loading: Loading }),
  "pdf-page-rotator": dynamic(() => import("./pdf/PdfRotator"), { loading: Loading }),
  "pdf-to-image": dynamic(() => import("./pdf/PdfToImage"), { loading: Loading }),
  "pdf-compressor": dynamic(() => import("./pdf/PdfCompressor"), { loading: Loading }),
  "gpa-calculator": dynamic(() => import("./student/GpaCalculator"), { loading: Loading }),
  "cgpa-calculator": dynamic(() => import("./student/CgpaCalculator"), { loading: Loading }),
  "percentage-calculator": dynamic(() => import("./student/PercentageCalculator"), { loading: Loading }),
  "marks-calculator": dynamic(() => import("./student/MarksCalculator"), { loading: Loading }),
  "grade-calculator": dynamic(() => import("./student/GradeCalculator"), { loading: Loading }),
  "study-hours-calculator": dynamic(() => import("./student/StudyHoursCalculator"), { loading: Loading }),
  "profit-margin-calculator": dynamic(() => import("./business/ProfitMargin"), { loading: Loading }),
  "product-pricing-calculator": dynamic(() => import("./business/ProductPricing"), { loading: Loading }),
  "discount-calculator": dynamic(() => import("./business/Discount"), { loading: Loading }),
  "markup-calculator": dynamic(() => import("./business/Markup"), { loading: Loading }),
  "break-even-calculator": dynamic(() => import("./business/BreakEven"), { loading: Loading }),
  "shipping-cost-calculator": dynamic(() => import("./business/Shipping"), { loading: Loading }),
  "vat-calculator": dynamic(() => import("./business/Vat"), { loading: Loading }),
  "json-formatter": dynamic(() => import("./dev/JsonTool"), { loading: Loading }),
  "json-validator": dynamic(() => import("./dev/JsonTool"), { loading: Loading }),
  "base64-encoder-decoder": dynamic(() => import("./dev/Base64Tool"), { loading: Loading }),
  "url-encoder-decoder": dynamic(() => import("./dev/UrlTool"), { loading: Loading }),
  "uuid-generator": dynamic(() => import("./dev/UuidTool"), { loading: Loading }),
  "html-formatter": dynamic(() => import("./dev/HtmlFormatter"), { loading: Loading }),
  "html-entity-encoder-decoder": dynamic(() => import("./dev/EntityTool"), { loading: Loading }),
  "timestamp-converter": dynamic(() => import("./dev/TimestampTool"), { loading: Loading }),
  "regex-tester": dynamic(() => import("./dev/RegexTester"), { loading: Loading }),
  "hash-generator": dynamic(() => import("./dev/HashTool"), { loading: Loading }),
  "word-counter": dynamic(() => import("./text/WordCounter"), { loading: Loading }),
  "character-counter": dynamic(() => import("./text/CharacterCounter"), { loading: Loading }),
  "case-converter": dynamic(() => import("./text/CaseConverter"), { loading: Loading }),
  "text-repeater": dynamic(() => import("./text/TextRepeater"), { loading: Loading }),
  "remove-extra-spaces": dynamic(() => import("./text/RemoveSpaces"), { loading: Loading }),
  "text-diff-checker": dynamic(() => import("./text/DiffChecker"), { loading: Loading }),
  "meta-tag-generator": dynamic(() => import("./text/MetaTagGenerator"), { loading: Loading }),
  "slug-generator": dynamic(() => import("./text/SlugGenerator"), { loading: Loading }),
  "robots-txt-generator": dynamic(() => import("./text/RobotsGenerator"), { loading: Loading }),
  "sitemap-xml-generator": dynamic(() => import("./text/SitemapGenerator"), { loading: Loading }),
};

export const implementedSlugs = Object.keys(registry);

export default function ToolRenderer({ slug }: ToolProps) {
  useEffect(() => {
    pushRecent(slug);
    track("tool_view", { tool: slug });
  }, [slug]);
  const C = registry[slug];
  if (!C) return null;
  return <C slug={slug} />;
}
