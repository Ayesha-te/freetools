export type CategorySlug = "image" | "pdf" | "student" | "business" | "developer" | "text-seo";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  title: string;
  metaDescription: string;
  intro: string[];
  icon: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: CategorySlug;
  /** One-line summary for cards. */
  summary: string;
  /** <title> text (site name is appended). */
  title: string;
  metaDescription: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
}

export const categories: Category[] = [
  {
    slug: "image",
    name: "Image Tools",
    short: "Compress, resize, crop and convert images",
    title: "Free Image Tools – Compress, Resize & Convert",
    metaDescription:
      "Compress images to a target size, resize, crop and convert between JPG and PNG. Everything runs in your browser, so your photos never leave your device.",
    icon: "Image",
    intro: [
      "Image files are often too large for upload forms, email attachments or web pages. These tools help you shrink, reshape and convert pictures without installing software.",
      "Every image tool on ToolSprint uses your browser's built-in Canvas engine. Files are decoded and re-encoded on your own device, which is faster than uploading and keeps private photos such as ID scans and documents off our servers.",
      "Start with the Image Compressor if you simply want a smaller file, use the 50KB or 100KB tools when a form enforces a strict limit, and use the Resizer or Cropper when the pixel dimensions themselves need to change.",
    ],
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    short: "Merge, split, rotate and convert PDFs",
    title: "Free PDF Tools – Merge, Split, Rotate & Convert",
    metaDescription:
      "Merge, split, extract, rotate and compress PDF files or convert between PDF and images. Processed locally in your browser with open-source libraries.",
    icon: "FileText",
    intro: [
      "PDF is the standard format for forms, invoices, coursework and contracts, yet small edits such as combining two files or removing a page usually require paid software.",
      "Our PDF tools are built on the open-source pdf-lib and Mozilla PDF.js libraries and run entirely inside your browser tab. Documents are not uploaded, which matters when you are handling bank statements, medical letters or signed agreements.",
      "Large or scanned PDFs need more memory, so very big files may be slow on older phones. Each tool page explains its limits honestly, including when compression cannot make a file smaller.",
    ],
  },
  {
    slug: "student",
    name: "Student Tools",
    short: "GPA, CGPA, percentage and grade calculators",
    title: "Free Student Calculators – GPA, CGPA & Grades",
    metaDescription:
      "Calculate GPA and CGPA with your own grading scale, work out percentages and marks, find the score you need on a final exam and plan weekly study hours.",
    icon: "GraduationCap",
    intro: [
      "Universities and school boards use very different grading systems, so a calculator that assumes one fixed scale can give you the wrong answer. Every student tool here lets you see and adjust the scale or weights it uses.",
      "Each calculator shows the formula behind its result, so you can check the maths yourself or reproduce it in an exam. Results are estimates for planning: your institution's official transcript is always the final authority.",
    ],
  },
  {
    slug: "business",
    name: "Business Tools",
    short: "Margin, pricing, VAT and break-even calculators",
    title: "Free Business Calculators – Margin, VAT & More",
    metaDescription:
      "Work out profit margin, markup, selling price, discounts, VAT and break-even point. Choose your own currency and tax rate and see every formula used.",
    icon: "Briefcase",
    intro: [
      "Small business owners, freelancers and online sellers make pricing decisions every day. These calculators turn the standard formulas into quick, checkable answers.",
      "You choose the currency symbol and enter your own tax, shipping and cost figures. We do not fetch live tax rates or carrier prices, because those change often and vary by location; always confirm official rates with your tax authority or carrier.",
    ],
  },
  {
    slug: "developer",
    name: "Developer Tools",
    short: "JSON, Base64, regex, hashing and more",
    title: "Free Developer Tools – JSON, Base64, Regex & Hash",
    metaDescription:
      "Format and validate JSON, encode Base64 and URLs, test regular expressions, generate UUIDs and hashes, and convert Unix timestamps — all client-side.",
    icon: "Code",
    intro: [
      "Everyday developer chores such as pretty-printing an API response or decoding a token should not require sending data to an unknown server. Every developer tool here runs locally in JavaScript.",
      "That makes them safe to use with configuration files, internal API payloads and test credentials. Hashes use the Web Crypto API built into your browser, and the regex tester runs in a separate worker so a runaway pattern cannot freeze the page.",
    ],
  },
  {
    slug: "text-seo",
    name: "Text & SEO Tools",
    short: "Counters, converters and SEO file generators",
    title: "Free Text & SEO Tools – Word Counter & Meta Tags",
    metaDescription:
      "Count words and characters, convert case, compare text, clean up spacing and generate meta tags, slugs, robots.txt and XML sitemaps for your website.",
    icon: "Type",
    intro: [
      "Writers, students and site owners often need small text utilities: a reliable word count, a clean URL slug, or a quick way to compare two drafts.",
      "The SEO generators create correctly formatted meta tags, robots.txt files and XML sitemaps from the details you enter. They do not provide keyword search volumes, rankings or backlink data, and no tool can guarantee search rankings.",
    ],
  },
];

export const tools: ToolMeta[] = [
  // IMAGE
  { slug: "image-compressor", name: "Image Compressor", category: "image", icon: "Minimize2", popular: true,
    summary: "Reduce JPG, PNG and WebP file size with a quality slider.",
    title: "Image Compressor – Reduce JPG, PNG & WebP Size",
    metaDescription: "Compress JPG, PNG and WebP images in your browser. Adjust quality and maximum dimensions, compare before and after, and download the smaller file.",
    keywords: ["compress image", "reduce image size", "jpg compressor", "png compressor", "webp", "optimize photo"] },
  { slug: "compress-image-to-50kb", name: "Compress Image to 50KB", category: "image", icon: "Target",
    summary: "Shrink a photo or scan to 50KB or less for upload forms.",
    title: "Compress Image to 50KB – Meet Upload Limits",
    metaDescription: "Reduce a JPG or PNG to 50KB or less for exam, job and government application forms. Shows the real final size and never fakes the result.",
    keywords: ["50kb", "compress photo to 50kb", "signature 50kb", "passport photo size", "application form photo"] },
  { slug: "compress-image-to-100kb", name: "Compress Image to 100KB", category: "image", icon: "Target",
    summary: "Get any image under 100KB while keeping it as sharp as possible.",
    title: "Compress Image to 100KB – Keep Photos Sharp",
    metaDescription: "Compress a photo to 100KB or less in your browser. Iterative quality search keeps as much detail as possible and reports the exact final size.",
    keywords: ["100kb", "compress image to 100kb", "reduce photo to 100kb", "resume photo", "upload limit"] },
  { slug: "image-resizer", name: "Image Resizer", category: "image", icon: "Scaling", popular: true,
    summary: "Change image width and height in pixels or by percentage.",
    title: "Image Resizer – Resize by Pixels or Percent",
    metaDescription: "Resize JPG, PNG and WebP images to exact pixel dimensions or a percentage, with optional aspect-ratio lock. Free and processed on your device.",
    keywords: ["resize image", "change image dimensions", "scale photo", "image width height", "resize picture"] },
  { slug: "jpg-to-png", name: "JPG to PNG", category: "image", icon: "FileImage",
    summary: "Convert JPG photos to lossless PNG files.",
    title: "JPG to PNG Converter – Convert JPEG Images to PNG",
    metaDescription: "Convert JPG or JPEG images to PNG format in your browser. Batch convert several files and download each PNG instantly without uploading.",
    keywords: ["jpg to png", "jpeg to png", "convert jpg", "png converter"] },
  { slug: "png-to-jpg", name: "PNG to JPG", category: "image", icon: "FileImage",
    summary: "Convert PNG to JPG with a background colour for transparency.",
    title: "PNG to JPG Converter – Convert PNG Images to JPEG",
    metaDescription: "Convert PNG images to JPG with adjustable quality and a background colour for transparent areas. Batch conversion, processed locally.",
    keywords: ["png to jpg", "png to jpeg", "convert png", "jpg converter", "transparent png"] },
  { slug: "image-cropper", name: "Image Cropper", category: "image", icon: "Crop",
    summary: "Crop images freely or to common aspect ratios.",
    title: "Image Cropper – Crop Photos to Any Aspect Ratio",
    metaDescription: "Crop JPG, PNG and WebP images with a draggable crop box or exact pixel values. Presets for 1:1, 4:3, 16:9 and passport-style ratios.",
    keywords: ["crop image", "crop photo", "square crop", "aspect ratio", "cut image"] },
  // PDF
  { slug: "pdf-merger", name: "PDF Merger", category: "pdf", icon: "Combine", popular: true,
    summary: "Combine multiple PDF files into one in any order.",
    title: "PDF Merger – Combine Multiple PDF Files Into One",
    metaDescription: "Merge several PDF files into a single document. Reorder files before merging. Runs in your browser with pdf-lib; files are not uploaded.",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf combiner"] },
  { slug: "pdf-splitter", name: "PDF Splitter", category: "pdf", icon: "Split",
    summary: "Split a PDF into single pages, fixed chunks or custom ranges.",
    title: "PDF Splitter – Split a PDF Into Separate Files",
    metaDescription: "Split a PDF into individual pages, groups of N pages or custom ranges. Download each part or everything as a ZIP. Processed locally.",
    keywords: ["split pdf", "separate pdf pages", "divide pdf", "pdf to single pages"] },
  { slug: "pdf-page-extractor", name: "PDF Page Extractor", category: "pdf", icon: "FileOutput",
    summary: "Pull selected pages out of a PDF into a new file.",
    title: "PDF Page Extractor – Pull Pages From a PDF",
    metaDescription: "Choose the pages you need, such as 1-3, 7, 10-12, and save them as a new PDF. Preview pages first. Works offline in your browser.",
    keywords: ["extract pdf pages", "select pages pdf", "save pdf pages", "remove pages from pdf"] },
  { slug: "image-to-pdf", name: "Image to PDF", category: "pdf", icon: "FileImage", popular: true,
    summary: "Turn JPG and PNG images into a single PDF document.",
    title: "Image to PDF Converter – JPG and PNG to PDF",
    metaDescription: "Convert one or many JPG and PNG images into a PDF. Choose A4, Letter or fit-to-image pages, set margins and reorder images before saving.",
    keywords: ["jpg to pdf", "image to pdf", "png to pdf", "photos to pdf", "scan to pdf"] },
  { slug: "pdf-page-rotator", name: "PDF Page Rotator", category: "pdf", icon: "RotateCw",
    summary: "Rotate all or individual PDF pages and save the result.",
    title: "Rotate PDF Pages – Fix Sideways or Upside-Down",
    metaDescription: "Rotate every page or just selected pages of a PDF by 90, 180 or 270 degrees with live thumbnails. Free and private, no upload required.",
    keywords: ["rotate pdf", "turn pdf page", "fix pdf orientation", "pdf rotate"] },
  { slug: "pdf-to-image", name: "PDF to Image", category: "pdf", icon: "Images",
    summary: "Convert PDF pages to PNG or JPG images.",
    title: "PDF to Image Converter – PDF Pages to JPG or PNG",
    metaDescription: "Render PDF pages as high-quality PNG or JPG images with selectable resolution. Download single pages or a ZIP of all pages.",
    keywords: ["pdf to jpg", "pdf to png", "pdf to image", "convert pdf page"] },
  { slug: "pdf-compressor", name: "PDF Compressor", category: "pdf", icon: "FileArchive",
    summary: "Reduce PDF size with lossless cleanup or image-based compression.",
    title: "PDF Compressor – Reduce PDF File Size Honestly",
    metaDescription: "Try to shrink a PDF using lossless restructuring or stronger image-based compression. Shows the real result and tells you if it could not be reduced.",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "pdf optimizer"] },
  // STUDENT
  { slug: "gpa-calculator", name: "GPA Calculator", category: "student", icon: "GraduationCap", popular: true,
    summary: "Credit-weighted semester GPA with editable grading scales.",
    title: "GPA Calculator – Semester GPA, Custom Scales",
    metaDescription: "Calculate your semester GPA from letter grades and credit hours. Choose a 4.0, 4.0 plus/minus, 4.3 or 5.0 scale, or edit grade points yourself.",
    keywords: ["gpa calculator", "semester gpa", "grade point average", "credit hours", "4.0 scale"] },
  { slug: "cgpa-calculator", name: "CGPA Calculator", category: "student", icon: "Layers",
    summary: "Combine semester GPAs into a cumulative GPA.",
    title: "CGPA Calculator – Cumulative GPA Across Semesters",
    metaDescription: "Calculate cumulative GPA (CGPA) from each semester's GPA and credits, or update an existing CGPA with a new semester. Weighted correctly.",
    keywords: ["cgpa calculator", "cumulative gpa", "overall gpa", "semester gpa average"] },
  { slug: "percentage-calculator", name: "Percentage Calculator", category: "student", icon: "Percent", popular: true,
    summary: "Percent of a number, percent change and more.",
    title: "Percentage Calculator – Percent Of & % Change",
    metaDescription: "Find X% of a number, what percent one number is of another, and percentage increase or decrease. Clear formulas shown for each answer.",
    keywords: ["percentage calculator", "percent of", "percentage change", "percent increase", "percent decrease"] },
  { slug: "marks-calculator", name: "Marks Calculator", category: "student", icon: "ClipboardList",
    summary: "Total marks across subjects and overall percentage.",
    title: "Marks Calculator – Total Marks & Percentage",
    metaDescription: "Add up obtained and maximum marks for each subject to get your total and percentage, and see how many marks you need to reach a target.",
    keywords: ["marks calculator", "marks percentage", "total marks", "exam marks", "board exam percentage"] },
  { slug: "grade-calculator", name: "Grade Calculator", category: "student", icon: "BarChart3",
    summary: "Weighted course grade and the final exam score you need.",
    title: "Grade Calculator – Weighted Grade & Final Needed",
    metaDescription: "Enter assignment and exam scores with their weights to get your current course grade, and find the final exam score needed for your target.",
    keywords: ["grade calculator", "weighted grade", "final exam calculator", "what do i need on my final"] },
  { slug: "study-hours-calculator", name: "Study Hours Calculator", category: "student", icon: "Clock",
    summary: "Plan weekly study time per subject by credits and difficulty.",
    title: "Study Hours Calculator – Plan Weekly Study Time",
    metaDescription: "Estimate weekly study hours from credit hours and subject difficulty, then split the time across your study days with a clear plan.",
    keywords: ["study hours", "study planner", "how many hours to study", "weekly study schedule"] },
  // BUSINESS
  { slug: "profit-margin-calculator", name: "Profit Margin Calculator", category: "business", icon: "TrendingUp", popular: true,
    summary: "Gross profit, margin and markup from cost and revenue.",
    title: "Profit Margin Calculator – Gross Profit & Margin",
    metaDescription: "Enter cost and selling price to calculate gross profit, profit margin percentage and markup. Choose your currency and see the formulas.",
    keywords: ["profit margin calculator", "gross margin", "profit percentage", "margin formula"] },
  { slug: "product-pricing-calculator", name: "Product Pricing Calculator", category: "business", icon: "Tag",
    summary: "Find a selling price from costs, target margin and tax.",
    title: "Product Pricing Calculator – Price From Margin",
    metaDescription: "Calculate the selling price needed for a target profit margin, including fees and sales tax. Useful for e-commerce, crafts and wholesale.",
    keywords: ["pricing calculator", "selling price", "target margin price", "product price formula"] },
  { slug: "discount-calculator", name: "Discount Calculator", category: "business", icon: "BadgePercent",
    summary: "Sale price, savings and stacked discounts.",
    title: "Discount Calculator – Sale Price & Savings",
    metaDescription: "Calculate the final price after a percentage or fixed discount, including stacked discounts and tax. Shows how much you save.",
    keywords: ["discount calculator", "sale price", "percent off", "stacked discount"] },
  { slug: "markup-calculator", name: "Markup Calculator", category: "business", icon: "ArrowUpRight",
    summary: "Price from cost and markup, or markup from cost and price.",
    title: "Markup Calculator – Markup Percentage & Price",
    metaDescription: "Find the selling price from cost and markup percentage, or the markup from cost and price. Explains the difference between markup and margin.",
    keywords: ["markup calculator", "markup percentage", "cost plus pricing", "markup vs margin"] },
  { slug: "break-even-calculator", name: "Break-Even Calculator", category: "business", icon: "Scale",
    summary: "Units and revenue needed to cover fixed costs.",
    title: "Break-Even Calculator – Units & Revenue Needed",
    metaDescription: "Calculate break-even units and revenue from fixed costs, price per unit and variable cost per unit. Includes contribution margin and target profit.",
    keywords: ["break even calculator", "break-even point", "contribution margin", "units to break even"] },
  { slug: "shipping-cost-calculator", name: "Shipping Cost Calculator", category: "business", icon: "Truck",
    summary: "Estimate parcel cost with volumetric weight and your own rates.",
    title: "Shipping Cost Calculator – Volumetric Weight",
    metaDescription: "Estimate shipping cost from parcel weight, dimensions and your carrier's rates. Calculates volumetric and chargeable weight. No live rates.",
    keywords: ["shipping cost calculator", "volumetric weight", "dimensional weight", "parcel cost"] },
  { slug: "vat-calculator", name: "VAT Calculator", category: "business", icon: "Receipt", popular: true,
    summary: "Add or remove VAT or sales tax at any rate.",
    title: "VAT Calculator – Add or Remove VAT at Any Rate",
    metaDescription: "Add VAT to a net price or extract VAT from a gross price using any rate you enter. Works for GST and sales tax too. Shows every formula.",
    keywords: ["vat calculator", "add vat", "remove vat", "reverse vat", "gst calculator", "sales tax"] },
  // DEVELOPER
  { slug: "json-formatter", name: "JSON Formatter", category: "developer", icon: "Braces", popular: true,
    summary: "Pretty-print or minify JSON with custom indentation.",
    title: "JSON Formatter – Beautify & Minify JSON Online",
    metaDescription: "Format messy JSON with 2-space, 4-space or tab indentation, sort keys, or minify it. Errors show the exact line and column. Runs locally.",
    keywords: ["json formatter", "json beautifier", "pretty print json", "minify json"] },
  { slug: "json-validator", name: "JSON Validator", category: "developer", icon: "CheckCircle2",
    summary: "Check JSON syntax and pinpoint errors by line and column.",
    title: "JSON Validator – Find JSON Syntax Errors by Line",
    metaDescription: "Validate JSON instantly as you type. Pinpoints the line and column of syntax errors and explains common mistakes like trailing commas.",
    keywords: ["json validator", "validate json", "json lint", "json syntax error"] },
  { slug: "base64-encoder-decoder", name: "Base64 Encoder/Decoder", category: "developer", icon: "Binary",
    summary: "Encode and decode Base64 text and files, UTF-8 safe.",
    title: "Base64 Encoder & Decoder – Text & Files",
    metaDescription: "Encode text or files to Base64 and decode Base64 back to text, with URL-safe variant and full UTF-8 support. Nothing is uploaded.",
    keywords: ["base64 encode", "base64 decode", "base64 converter", "data uri"] },
  { slug: "url-encoder-decoder", name: "URL Encoder/Decoder", category: "developer", icon: "Link",
    summary: "Percent-encode or decode URLs and query parameters.",
    title: "URL Encoder & Decoder – Percent-Encode URLs",
    metaDescription: "Encode or decode URLs and query parameters using encodeURIComponent or encodeURI rules. Also parses a URL into its query parameters.",
    keywords: ["url encode", "url decode", "percent encoding", "query string"] },
  { slug: "uuid-generator", name: "UUID Generator", category: "developer", icon: "Fingerprint",
    summary: "Generate random version 4 UUIDs in bulk.",
    title: "UUID Generator – Random Version 4 UUIDs in Bulk",
    metaDescription: "Generate cryptographically random UUID v4 values, one or up to 1,000 at a time, in lowercase, uppercase or without hyphens.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "random id"] },
  { slug: "html-formatter", name: "HTML Formatter", category: "developer", icon: "FileCode",
    summary: "Indent and tidy HTML markup, or minify it.",
    title: "HTML Formatter – Beautify & Indent HTML Code",
    metaDescription: "Format messy or minified HTML with consistent indentation, or collapse it into compact markup. Preserves pre, script and style contents.",
    keywords: ["html formatter", "html beautifier", "indent html", "tidy html"] },
  { slug: "html-entity-encoder-decoder", name: "HTML Entity Encoder/Decoder", category: "developer", icon: "Ampersand",
    summary: "Escape special characters as HTML entities and back.",
    title: "HTML Entity Encoder & Decoder – Escape Text",
    metaDescription: "Convert <, >, &, quotes and non-ASCII characters into HTML entities, or decode named and numeric entities back into text.",
    keywords: ["html entities", "html escape", "html unescape", "encode html"] },
  { slug: "timestamp-converter", name: "Timestamp Converter", category: "developer", icon: "CalendarClock",
    summary: "Convert Unix timestamps to dates and back.",
    title: "Unix Timestamp Converter – Epoch to Date and Back",
    metaDescription: "Convert Unix epoch timestamps in seconds or milliseconds to human-readable UTC and local dates, and convert dates back to timestamps.",
    keywords: ["unix timestamp", "epoch converter", "timestamp to date", "date to timestamp"] },
  { slug: "regex-tester", name: "Regex Tester", category: "developer", icon: "Regex",
    summary: "Test JavaScript regular expressions with live highlighting.",
    title: "Regex Tester – Test JavaScript Regex Live",
    metaDescription: "Test JavaScript regular expressions against sample text with highlighted matches, capture groups, flags and replacement preview.",
    keywords: ["regex tester", "regular expression", "regex online", "javascript regex"] },
  { slug: "hash-generator", name: "Hash Generator", category: "developer", icon: "Hash",
    summary: "MD5, SHA-1, SHA-256, SHA-384 and SHA-512 for text or files.",
    title: "Hash Generator – MD5, SHA-1, SHA-256 & SHA-512",
    metaDescription: "Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes for text or files using the Web Crypto API. Compare against an expected checksum.",
    keywords: ["hash generator", "sha256", "md5", "checksum", "sha512"] },
  // TEXT & SEO
  { slug: "word-counter", name: "Word Counter", category: "text-seo", icon: "FileText", popular: true,
    summary: "Words, sentences, paragraphs and reading time.",
    title: "Word Counter – Words, Sentences & Reading Time",
    metaDescription: "Count words, characters, sentences and paragraphs as you type, with reading and speaking time estimates and most-used words.",
    keywords: ["word counter", "word count", "essay word count", "reading time"] },
  { slug: "character-counter", name: "Character Counter", category: "text-seo", icon: "LetterText",
    summary: "Characters with and without spaces, with platform limits.",
    title: "Character Counter – Count Characters With Limits",
    metaDescription: "Count characters with and without spaces, bytes and lines, and track limits for meta descriptions, SMS and social posts as you type.",
    keywords: ["character counter", "letter count", "character limit", "count characters"] },
  { slug: "case-converter", name: "Case Converter", category: "text-seo", icon: "CaseSensitive",
    summary: "UPPER, lower, Title, Sentence, camelCase, snake_case and more.",
    title: "Case Converter – Upper, Lower, Title & camelCase",
    metaDescription: "Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case and more.",
    keywords: ["case converter", "uppercase", "lowercase", "title case", "camelcase"] },
  { slug: "text-repeater", name: "Text Repeater", category: "text-seo", icon: "Repeat",
    summary: "Repeat text a set number of times with a separator.",
    title: "Text Repeater – Repeat Text or Words Online",
    metaDescription: "Repeat any word, line or block of text up to 10,000 times with a separator of your choice, optional numbering, and copy or download.",
    keywords: ["text repeater", "repeat text", "repeat words", "duplicate text"] },
  { slug: "remove-extra-spaces", name: "Remove Extra Spaces", category: "text-seo", icon: "Eraser",
    summary: "Clean double spaces, tabs, blank lines and line breaks.",
    title: "Remove Extra Spaces – Clean Up Whitespace in Text",
    metaDescription: "Remove double spaces, leading and trailing spaces, tabs and empty lines, or join broken lines from PDFs. Choose exactly what to clean.",
    keywords: ["remove extra spaces", "remove whitespace", "remove line breaks", "clean text"] },
  { slug: "text-diff-checker", name: "Text Diff Checker", category: "text-seo", icon: "GitCompare",
    summary: "Compare two texts and highlight additions and deletions.",
    title: "Text Diff Checker – Compare Two Texts Online",
    metaDescription: "Compare two versions of text line by line or word by word. Highlights additions and deletions, with options to ignore case and whitespace.",
    keywords: ["diff checker", "compare text", "text difference", "compare documents"] },
  { slug: "meta-tag-generator", name: "Meta Tag Generator", category: "text-seo", icon: "Code2",
    summary: "Title, description, Open Graph and Twitter tags.",
    title: "Meta Tag Generator – Title, Description & OG",
    metaDescription: "Generate HTML meta tags including title, description, canonical, robots, Open Graph and Twitter Card tags, with length guidance.",
    keywords: ["meta tag generator", "open graph", "twitter card", "meta description"] },
  { slug: "slug-generator", name: "Slug Generator", category: "text-seo", icon: "Link2",
    summary: "Turn titles into clean, URL-friendly slugs.",
    title: "Slug Generator – Clean URL Slugs From Titles",
    metaDescription: "Convert titles into clean URL slugs. Removes accents and symbols, optionally drops stop words, and supports hyphen or underscore separators.",
    keywords: ["slug generator", "url slug", "permalink", "seo friendly url"] },
  { slug: "robots-txt-generator", name: "Robots.txt Generator", category: "text-seo", icon: "Bot",
    summary: "Build a valid robots.txt with rules and sitemap.",
    title: "Robots.txt Generator – Create a robots.txt File",
    metaDescription: "Create a robots.txt file with allow and disallow rules per user agent and a sitemap line. Explains what robots.txt can and cannot do.",
    keywords: ["robots.txt generator", "robots txt", "disallow", "crawler rules"] },
  { slug: "sitemap-xml-generator", name: "Sitemap XML Generator", category: "text-seo", icon: "Network",
    summary: "Create an XML sitemap from a list of URLs.",
    title: "Sitemap XML Generator – XML Sitemap From URLs",
    metaDescription: "Paste your page URLs to generate a valid XML sitemap with optional lastmod dates. Validates URLs and escapes special characters.",
    keywords: ["sitemap generator", "xml sitemap", "sitemap.xml", "search console sitemap"] },
];

export const toolMap: Record<string, ToolMeta> = Object.fromEntries(tools.map((t) => [t.slug, t]));
export const categoryMap: Record<string, Category> = Object.fromEntries(categories.map((c) => [c.slug, c]));

export function toolsInCategory(slug: CategorySlug) {
  return tools.filter((t) => t.category === slug);
}

export function toolHref(slug: string) {
  return `/tools/${slug}/`;
}
export function categoryHref(slug: string) {
  return `/categories/${slug}/`;
}

/** Search used by navbar suggestions and the All Tools page. */
export function searchTools(query: string, limit = 50): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = tools
    .map((t) => {
      const name = t.name.toLowerCase();
      const hay = [name, t.summary.toLowerCase(), ...t.keywords, categoryMap[t.category].name.toLowerCase()].join(" ");
      if (!terms.every((term) => hay.includes(term))) return null;
      let score = 0;
      if (name === q) score += 100;
      if (name.startsWith(q)) score += 50;
      if (name.includes(q)) score += 25;
      if (t.keywords.some((k) => k.includes(q))) score += 10;
      if (t.popular) score += 2;
      return { t, score };
    })
    .filter((x): x is { t: ToolMeta; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.t);
}
