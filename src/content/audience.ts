/**
 * "Who it's for" and "Key features" sections for every tool page.
 * Features describe only what the tool actually implements — keep this in sync with the components.
 */
export const audience: Record<string, { audience: string[]; features: string[] }> = {
  // ---------- Image ----------
  "image-compressor": {
    audience: [
      "Bloggers and website owners who want pages to load faster without visibly worse photos.",
      "Anyone emailing or messaging photos that bounce because the attachment is too large.",
      "Online sellers preparing product photos for marketplaces with file-size limits.",
    ],
    features: [
      "Quality slider with a side-by-side before/after preview and the exact size saving.",
      "Output as JPG, WebP or PNG, with an optional maximum width/height.",
      "Honest result: if re-encoding would make the file bigger, the tool tells you.",
      "Location and camera metadata are not copied into the compressed file.",
    ],
  },
  "compress-image-to-50kb": {
    audience: [
      "Job, exam and university applicants whose online form caps photos or signatures at 50 KB.",
      "Government and visa portal users uploading passport-style photos or document scans.",
      "Anyone who needs a file under an exact size rather than a quality percentage.",
    ],
    features: [
      "Automatic search over quality levels (and dimensions if needed) to land under your target.",
      "Adjustable target from 5 KB to 20,000 KB, so it also works for 20 KB or 40 KB limits.",
      "Optional maximum width/height for forms that specify pixel dimensions too.",
      "Clear report of final size, quality used and any dimension change.",
    ],
  },
  "compress-image-to-100kb": {
    audience: [
      "Job seekers attaching a profile or resume photo to an application portal.",
      "Students and staff uploading ID photos to college or HR systems with a 100 KB limit.",
      "Forum and CMS users whose upload field rejects larger images.",
    ],
    features: [
      "Targets 100 KB by default, adjustable to any size between 5 KB and 20,000 KB.",
      "JPG output for maximum compatibility, or WebP for an even smaller file.",
      "Shows the final size, quality setting and whether the image was scaled down.",
      "Original file is never modified — you download a separate copy.",
    ],
  },
  "compress-image-to-20kb": {
    audience: [
      "Applicants uploading a scanned signature to exam, job or bank portals that cap it at 10–20 KB.",
      "Students submitting small thumbnail photos to admission or scholarship forms.",
      "Anyone whose upload field rejects an image as too large at a 20 KB limit.",
    ],
    features: [
      "Targets 20 KB by default and searches quality levels automatically to land under it.",
      "Scales the image down in small steps only when quality alone cannot reach the target.",
      "Optional maximum width/height for forms that also specify pixel dimensions.",
      "Reports the final size, the quality used and any dimension change.",
    ],
  },
  "compress-image-to-30kb": {
    audience: [
      "Job and exam applicants whose photo field accepts files of 30 KB or less.",
      "Users of government, visa or recruitment portals with strict photo size rules.",
      "Anyone who needs a little more detail than a 20 KB file allows.",
    ],
    features: [
      "30 KB default target, adjustable anywhere from 5 KB to 20,000 KB.",
      "Keeps the highest quality that still fits, so faces and text stay as clear as possible.",
      "JPG output for maximum compatibility, or WebP where the form accepts it.",
      "Never claims success unless the file is really at or under your target.",
    ],
  },
  "compress-image-to-200kb": {
    audience: [
      "People uploading ID card, certificate or document scans to portals with a 200 KB limit.",
      "Sellers and bloggers who want sharp photos that still load quickly.",
      "Anyone sending phone photos through forms or email systems that reject larger files.",
    ],
    features: [
      "200 KB default target: enough for most photos to keep full resolution.",
      "Automatic quality search finds the sharpest result under the limit.",
      "Works on JPG, PNG, WebP, GIF and BMP files up to 40 MB.",
      "Your original file is never changed; you download a separate copy.",
    ],
  },
  "image-resizer": {
    audience: [
      "Social media managers who need images at platform-friendly dimensions.",
      "Web developers producing hero images, thumbnails and icons at exact sizes.",
      "Anyone shrinking a large camera photo before sharing or uploading it.",
    ],
    features: [
      "Resize by exact pixels or by percentage, with a lock to keep proportions.",
      "Ready-made size presets for common uses.",
      "Keep the original format or convert to JPG, PNG or WebP while resizing.",
      "Warns you when you are enlarging an image, since that cannot add detail.",
    ],
  },
  "jpg-to-png": {
    audience: [
      "Designers who need a lossless copy of a JPG before editing it repeatedly.",
      "Students and office users whose software or template only accepts PNG.",
      "Anyone converting a batch of photos in one go.",
    ],
    features: [
      "Batch conversion of up to 30 JPG/JPEG files at once.",
      "Lossless PNG output, so no further quality is lost after conversion.",
      "Download files individually or together as a ZIP.",
    ],
  },
  "png-to-jpg": {
    audience: [
      "Website owners replacing heavy PNG photos with lighter JPGs.",
      "Anyone whose upload form accepts only JPG/JPEG.",
      "People sharing screenshots who want smaller files.",
    ],
    features: [
      "Batch conversion of up to 30 PNG files.",
      "Adjustable JPG quality from 40% to 100%.",
      "Choose the background colour used to fill transparent areas.",
      "Download individually or as a single ZIP.",
    ],
  },
  "image-cropper": {
    audience: [
      "Applicants preparing passport-shaped photos (35:45) before checking official rules.",
      "Social media users cropping to square, portrait or widescreen ratios.",
      "Anyone removing unwanted edges or distractions from a picture.",
    ],
    features: [
      "Free cropping or fixed aspect ratios, including 1:1, 16:9 and 35:45.",
      "Drag-to-move box with corner handles, plus number fields for pixel-exact crops.",
      "Preview before download; output stays in the original format family.",
    ],
  },

  // ---------- PDF ----------
  "pdf-merger": {
    audience: [
      "Students combining assignment pages or certificates into one submission file.",
      "Office workers assembling invoices, contracts and appendices into a single PDF.",
      "Job applicants joining a CV, cover letter and certificates.",
    ],
    features: [
      "Merge up to 50 PDFs (300 MB in total) in any order you choose.",
      "Reorder with up/down arrows and remove files before merging.",
      "Progress bar for large merges; files never leave your device.",
    ],
  },
  "pdf-splitter": {
    audience: [
      "Accountants and admins separating a scanned batch into individual documents.",
      "Teachers splitting a long handout into chapters or weekly sections.",
      "Anyone who needs to send only part of a large PDF.",
    ],
    features: [
      "Three modes: every page, every N pages, or custom ranges such as 1-3, 4-10, 11-.",
      "Up to 500 output parts from one document.",
      "Download each part separately or all of them as a ZIP.",
    ],
  },
  "pdf-page-extractor": {
    audience: [
      "Professionals who need to share a few pages of a report without the rest.",
      "Students pulling specific chapters or exercises out of a textbook PDF.",
      "Anyone removing unwanted pages by keeping only the ones they need.",
    ],
    features: [
      "Visual page selection with thumbnails (first 60 pages) generated on your device.",
      "Type any page numbers or ranges, including open-ended ranges like 8-.",
      "Live count of selected pages; output is a single new PDF.",
    ],
  },
  "image-to-pdf": {
    audience: [
      "Students turning photos of handwritten work into one PDF to submit.",
      "Office users combining phone photos of receipts or forms.",
      "Anyone who needs to send several images as a single document.",
    ],
    features: [
      "Up to 100 images per PDF, with drag-free arrow reordering.",
      "A4, Letter or fit-to-image page sizes, portrait or landscape.",
      "Adjustable margins from 0 to 50 mm; images are scaled, never stretched or cropped.",
    ],
  },
  "pdf-page-rotator": {
    audience: [
      "Anyone with a scanned document where some pages came out sideways or upside down.",
      "Office workers fixing landscape tables inside portrait reports.",
      "Teachers and students correcting phone-scanned pages before printing.",
    ],
    features: [
      "Rotate every page at once or individual pages in 90° steps.",
      "Thumbnails show the result before you apply it.",
      "Only the page rotation changes — text and images are not re-encoded.",
    ],
  },
  "pdf-to-image": {
    audience: [
      "Social media and presentation users who need a PDF page as a picture.",
      "Designers and developers creating previews or thumbnails of documents.",
      "Anyone who needs to upload a PDF page where only images are accepted.",
    ],
    features: [
      "Choose 150 DPI for screens or 300 DPI for print quality.",
      "JPG for smaller files or PNG for crisp text and graphics.",
      "Convert a page range of up to 200 pages, downloadable individually or as a ZIP.",
    ],
  },
  "pdf-compressor": {
    audience: [
      "Applicants whose portal rejects PDFs above a size limit.",
      "Anyone emailing scanned documents that exceed attachment limits.",
      "Office users cleaning up PDFs exported from other software.",
    ],
    features: [
      "Lossless cleanup mode that keeps text selectable.",
      "Image-based mode with Light, Medium and Strong levels for scans.",
      "Reports the real size change, so you can keep the original if it isn't smaller.",
    ],
  },

  // ---------- Student ----------
  "gpa-calculator": {
    audience: [
      "University and college students checking their semester GPA before results are published.",
      "Applicants converting their grades into a GPA for scholarship or admission forms.",
      "Students on non-standard scales who need to enter custom grade points.",
    ],
    features: [
      "Built-in 4.0, 4.0 plus/minus, 4.3 and 5.0 scales, or a fully custom scale.",
      "Credit hours with half credits (for example 1.5).",
      "Shows total credits, quality points and the full formula with your numbers.",
    ],
  },
  "cgpa-calculator": {
    audience: [
      "Students tracking their cumulative GPA across several semesters.",
      "Graduates who need an overall CGPA for job or postgraduate applications.",
      "Students forecasting how a new semester will change their existing CGPA.",
    ],
    features: [
      "Two modes: calculate from all semesters, or update an existing CGPA with a new term.",
      "Works with any maximum GPA (4, 5, 10 and others).",
      "Credit-weighted average with a step-by-step explanation.",
    ],
  },
  "percentage-calculator": {
    audience: [
      "Students solving percentage questions and checking homework.",
      "Shoppers and professionals working out percentage changes in prices or figures.",
      "Anyone who needs a quick, explained percentage answer.",
    ],
    features: [
      "Four calculators: X% of Y, X is what percent of Y, percentage increase/decrease, and adding or subtracting a percentage.",
      "Results update as you type and accept decimals and negative numbers.",
      "Each answer shows the formula used.",
    ],
  },
  "marks-calculator": {
    audience: [
      "School and board-exam students calculating their total and overall percentage.",
      "Parents and teachers checking a student's aggregate across subjects.",
      "Students planning the marks they need in upcoming exams.",
    ],
    features: [
      "Per-subject percentage alongside the overall total and percentage.",
      "Target planner: enter a goal percentage and the marks still available.",
      "Any maximum marks per subject, with decimals allowed.",
    ],
  },
  "grade-calculator": {
    audience: [
      "Students asking “what do I need on my final exam?”.",
      "Students tracking a weighted course grade through the term.",
      "Tutors helping students set realistic targets.",
    ],
    features: [
      "Weighted current grade from any number of assessments.",
      "Score needed on remaining work to reach your target grade.",
      "Supports extra credit with scores up to 150%.",
    ],
  },
  "study-hours-calculator": {
    audience: [
      "New university students planning how much to study each week.",
      "Working or part-time students balancing study with other commitments.",
      "Anyone building a realistic weekly study timetable.",
    ],
    features: [
      "Weekly and daily study hours based on credits and your hours-per-credit ratio.",
      "Difficulty levels that adjust hours per subject.",
      "Per-subject breakdown for 1 to 7 study days a week.",
    ],
  },

  // ---------- Business ----------
  "profit-margin-calculator": {
    audience: [
      "Small business owners and online sellers checking whether a product is profitable.",
      "Freelancers comparing the margin on different services.",
      "Business students learning the difference between margin and markup.",
    ],
    features: [
      "Profit, gross margin and markup from cost and selling price.",
      "Optional units sold for total profit.",
      "Any currency symbol, with the formulas shown.",
    ],
  },
  "product-pricing-calculator": {
    audience: [
      "Marketplace sellers who need a price that covers commission and fees.",
      "Makers and small brands setting prices for a target profit margin.",
      "Anyone pricing a product with packaging, fees and tax to account for.",
    ],
    features: [
      "Recommended selling price from cost, target margin, percentage fees and fixed fees.",
      "Optional tax added on top for a tax-inclusive price.",
      "Breakdown of profit and fees per unit.",
    ],
  },
  "discount-calculator": {
    audience: [
      "Shoppers checking the real price of a sale item or coupon.",
      "Retailers planning promotions and stacked discounts.",
      "Anyone comparing a percentage discount with a fixed amount off.",
    ],
    features: [
      "Percentage or fixed-amount discounts.",
      "Optional second discount applied after the first, plus the effective total discount.",
      "Optional tax on the discounted price.",
    ],
  },
  "markup-calculator": {
    audience: [
      "Retailers and wholesalers using cost-plus pricing.",
      "Contractors adding a markup to materials.",
      "Anyone converting between markup and margin.",
    ],
    features: [
      "Find the selling price from a markup, or the markup from a selling price.",
      "Shows the profit and the equivalent margin for every result.",
    ],
  },
  "break-even-calculator": {
    audience: [
      "Founders and small business owners testing whether a plan is viable.",
      "Business and accounting students working through break-even problems.",
      "Sellers deciding how many units they must sell each month.",
    ],
    features: [
      "Break-even units (rounded up) and break-even revenue.",
      "Contribution margin per unit and as a percentage.",
      "Optional target profit to find the units needed to reach it.",
    ],
  },
  "shipping-cost-calculator": {
    audience: [
      "E-commerce sellers estimating parcel costs before quoting customers.",
      "Small businesses comparing carriers' volumetric weight rules.",
      "Anyone shipping a bulky but light parcel.",
    ],
    features: [
      "Metric (kg/cm) and imperial (lb/in) units.",
      "Volumetric weight with an adjustable carrier divisor, and the chargeable weight.",
      "Estimated total from base fee, rate per weight unit, fuel surcharge and handling.",
    ],
  },
  "vat-calculator": {
    audience: [
      "Freelancers and small businesses writing invoices.",
      "Shoppers and accountants separating tax from a tax-inclusive price.",
      "Anyone working with VAT, GST or a similar sales tax.",
    ],
    features: [
      "Add VAT to a net price or remove it from a gross price.",
      "Any rate from 0 to 100%.",
      "Shows net, tax and gross amounts with the formula.",
    ],
  },

  // ---------- Developer ----------
  "json-formatter": {
    audience: [
      "Developers reading minified API responses or log entries.",
      "QA testers and analysts inspecting JSON payloads.",
      "Anyone who needs to minify JSON before embedding it.",
    ],
    features: [
      "Beautify with 2 spaces, 4 spaces or tabs, or minify to one line.",
      "Optional alphabetical key sorting.",
      "Live validation message, copy button and .json download.",
    ],
  },
  "json-validator": {
    audience: [
      "Developers debugging a config file or API request that fails to parse.",
      "Students learning JSON syntax.",
      "Anyone pasting JSON into a system that rejects it.",
    ],
    features: [
      "Real-time validation as you type.",
      "Error position with the problem line highlighted and a hint.",
      "One click to view and copy a formatted version once valid.",
    ],
  },
  "base64-encoder-decoder": {
    audience: [
      "Developers working with tokens, API payloads and data URIs.",
      "Email and web developers embedding small files inline.",
      "Anyone decoding a Base64 string to see what it contains.",
    ],
    features: [
      "Encode and decode text instantly, with a URL-safe option.",
      "Encode files up to 10 MB to raw Base64 or a full data URI.",
      "Download decoded binary data as a file.",
    ],
  },
  "url-encoder-decoder": {
    audience: [
      "Developers building query strings and API calls.",
      "Marketers checking or building tracking URLs.",
      "Anyone reading a URL full of %20 and %3A sequences.",
    ],
    features: [
      "Component mode for single values and full-URL mode that keeps URL structure.",
      "Optional + for spaces when working with HTML form data.",
      "Clear error messages for malformed percent-encoding.",
    ],
  },
  "uuid-generator": {
    audience: [
      "Developers who need test IDs or primary keys.",
      "QA engineers creating sample data.",
      "Anyone who needs unique random identifiers in bulk.",
    ],
    features: [
      "Version 4 UUIDs from the browser's secure random generator.",
      "1 to 1,000 per batch.",
      "Formatting options such as uppercase, braces and hyphens; copy all or download as text.",
    ],
  },
  "html-formatter": {
    audience: [
      "Web developers tidying generated or minified HTML.",
      "Email developers reading template markup.",
      "Students learning how HTML is structured.",
    ],
    features: [
      "Re-indent HTML with your chosen indentation, or minify it.",
      "Handles full documents and fragments up to 5 MB.",
      "Copy the result or download it as an .html file.",
    ],
  },
  "html-entity-encoder-decoder": {
    audience: [
      "Developers displaying code or user text safely inside HTML.",
      "Content editors fixing &amp; and &quot; showing up in text.",
      "Anyone converting symbols to HTML entities.",
    ],
    features: [
      "Encode with options for non-ASCII characters and quotes.",
      "Decode named, decimal and hexadecimal entities.",
    ],
  },
  "timestamp-converter": {
    audience: [
      "Developers reading Unix timestamps in logs, databases and APIs.",
      "Analysts converting epoch values in exported data.",
      "Anyone who needs a date as a timestamp, or the reverse.",
    ],
    features: [
      "Auto-detects seconds or milliseconds.",
      "Shows UTC ISO, local time, HTTP date and a relative description.",
      "Converts a date and time (local or UTC) back to a timestamp.",
    ],
  },
  "regex-tester": {
    audience: [
      "JavaScript and web developers writing validation or parsing patterns.",
      "Data analysts extracting values from text.",
      "Students learning regular expressions.",
    ],
    features: [
      "Live highlighting of matches with all JavaScript flags.",
      "Table of match positions and capture groups, including named groups.",
      "Replacement preview using $1, $2 or $<name>.",
    ],
  },
  "hash-generator": {
    audience: [
      "Users verifying a downloaded file against a published checksum.",
      "Developers generating hashes for testing or integrity checks.",
      "Students learning about hash functions.",
    ],
    features: [
      "MD5, SHA-1, SHA-256, SHA-384 and SHA-512 at the same time.",
      "Hash text or files (up to 200 MB; MD5 up to 50 MB).",
      "Paste an expected checksum to see which algorithm matches.",
    ],
  },

  // ---------- Text & SEO ----------
  "word-counter": {
    audience: [
      "Students checking essays and assignments against a word limit.",
      "Writers, bloggers and copywriters tracking article length.",
      "Speakers estimating how long a speech will take.",
    ],
    features: [
      "Words, characters, sentences and paragraphs, updated as you type.",
      "Reading time (238 wpm) and speaking time (140 wpm).",
      "Most-used words list with an option to ignore common words.",
    ],
  },
  "character-counter": {
    audience: [
      "Social media managers writing posts for X/Twitter, Instagram and others.",
      "SEO writers checking title and meta description length.",
      "Developers checking database field or SMS limits.",
    ],
    features: [
      "Characters with and without spaces, words, lines, UTF-8 bytes and UTF-16 units.",
      "Progress bars for common platform limits.",
      "Add your own custom limit.",
    ],
  },
  "case-converter": {
    audience: [
      "Writers fixing text typed with Caps Lock on.",
      "Editors formatting headings in title or sentence case.",
      "Developers converting names to camelCase, snake_case or kebab-case.",
    ],
    features: [
      "12 cases: UPPERCASE, lowercase, Title, Sentence, camel, Pascal, snake, kebab, CONSTANT, dot, alternating and inverse.",
      "Convert again or reset to the original at any time.",
      "Copy or download the result.",
    ],
  },
  "text-repeater": {
    audience: [
      "Developers and testers generating repeated test input.",
      "Teachers creating practice sheets or templates.",
      "Anyone who needs the same line many times.",
    ],
    features: [
      "Set the repeat count and separator (new line, space, comma or custom).",
      "Optional numbering for each repetition.",
      "Copy or download outputs of up to 5 million characters.",
    ],
  },
  "remove-extra-spaces": {
    audience: [
      "Anyone cleaning text copied from PDFs, emails or web pages.",
      "Writers and editors tidying documents before publishing.",
      "Data users cleaning text before pasting into spreadsheets.",
    ],
    features: [
      "Collapse multiple spaces, trim line ends and convert tabs to spaces.",
      "Reduce or remove blank lines.",
      "Join broken PDF lines while keeping paragraph breaks; shows characters before and after.",
    ],
  },
  "text-diff-checker": {
    audience: [
      "Writers and editors comparing two drafts.",
      "Developers comparing config files or code snippets.",
      "Students and legal or admin staff checking what changed in a document.",
    ],
    features: [
      "Line-by-line or word-by-word comparison.",
      "Options to ignore case and whitespace-only changes.",
      "Highlighted additions and removals.",
    ],
  },
  "meta-tag-generator": {
    audience: [
      "Website owners and bloggers setting up page titles and descriptions.",
      "Developers adding Open Graph and Twitter/X card tags.",
      "SEO beginners learning which tags matter.",
    ],
    features: [
      "Title, description, canonical URL, robots and social image tags.",
      "Open Graph and Twitter/X card tags for website, article and product pages.",
      "Search preview and HTML-escaped output ready to paste into <head>.",
    ],
  },
  "slug-generator": {
    audience: [
      "Bloggers and content editors creating clean URLs.",
      "Developers generating slugs for CMS or e-commerce imports.",
      "SEO writers standardising URL formats.",
    ],
    features: [
      "Transliterates accents (é → e, ß → ss) and removes unsafe characters.",
      "Choose the separator and other options.",
      "Bulk mode: one slug per line for many titles.",
    ],
  },
  "robots-txt-generator": {
    audience: [
      "Website owners launching a new site.",
      "Developers blocking crawlers from admin or staging paths.",
      "SEO specialists adding sitemap references.",
    ],
    features: [
      "Rule groups for all crawlers or specific user agents.",
      "Allow and disallow paths with * and $ wildcards.",
      "Sitemap line and a downloadable robots.txt file.",
    ],
  },
  "sitemap-xml-generator": {
    audience: [
      "Owners of small static sites without an automatic sitemap.",
      "SEO specialists preparing a sitemap for Google Search Console.",
      "Developers converting a URL list into a valid sitemap.",
    ],
    features: [
      "Up to 50,000 URLs from a pasted list.",
      "Optional last-modified date and change frequency.",
      "Warnings for invalid lines and mixed domains; downloadable sitemap.xml.",
    ],
  },
};
