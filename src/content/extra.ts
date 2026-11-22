/** Additional, tool-specific FAQ entries appended to the main content. */
export const extraFaq: Record<string, { q: string; a: string }[]> = {
  "slug-generator": [
    { q: "How long should a URL slug be?", a: "Short enough to read at a glance — typically three to six meaningful words. Long slugs are not penalised directly, but they are harder to share and are often truncated in search results and messages." },
    { q: "Should I include dates or numbers in slugs?", a: "Avoid dates for content you plan to update, because the URL would look outdated. Numbers are fine when they are part of the meaning, such as a list of 10 tips, but remember to update the slug or redirect if the number changes." },
  ],
  "uuid-generator": [
    { q: "What is the difference between a UUID and a GUID?", a: "They are the same thing. GUID is the name Microsoft uses; UUID is the name used in the RFC standards. Both are 128-bit identifiers written as 32 hexadecimal digits." },
    { q: "Are UUID v4 values good database primary keys?", a: "They work well when IDs must be created on many machines without coordination. Because they are random, they can fragment some database indexes; time-ordered UUIDs (v7) reduce that effect for very large tables." },
    { q: "How do I validate a UUID?", a: "A version 4 UUID has the form 8-4-4-4-12 hex digits, the 13th digit is always 4, and the 17th digit is 8, 9, a or b." },
  ],
  "text-repeater": [
    { q: "Can I repeat text with a different number each time?", a: "Tick “Number each repetition” to prefix lines with 1., 2., 3. and so on. For more complex patterns, generate the list and edit it in a spreadsheet." },
    { q: "Why is the preview shorter than the copied text?", a: "Very long outputs are shown partially to keep the page responsive. Copy and Download always use the complete result." },
    { q: "Does it work with emoji and other languages?", a: "Yes. Any Unicode text, including emoji and non-Latin scripts, is repeated exactly as entered." },
  ],
  "case-converter": [
    { q: "What is snake_case used for?", a: "It is the conventional style for variable and function names in Python and Ruby, and for database column names. CONSTANT_CASE is used for constants and environment variables." },
    { q: "What is kebab-case used for?", a: "It is common in URLs, CSS class names and file names, because hyphens are readable and do not need escaping." },
  ],
  "sitemap-xml-generator": [
    { q: "Where should I upload sitemap.xml?", a: "Usually at the root of your site (https://www.example.com/sitemap.xml). Add a Sitemap line to robots.txt and submit the URL in Google Search Console and Bing Webmaster Tools." },
    { q: "How often should I update my sitemap?", a: "Whenever you add, remove or significantly change pages. Many content management systems regenerate it automatically; this tool is ideal for small static sites." },
  ],
  "html-formatter": [
    { q: "Why does my inline text stay on one line?", a: "Inline elements such as a, strong and span are kept with the surrounding text, because adding line breaks inside them could change how spacing renders in the browser." },
    { q: "Should I minify HTML for production?", a: "It saves some bytes, but server compression (gzip or Brotli) already removes most of the benefit. Minify if your build pipeline does not do it already." },
  ],
  "hash-generator": [
    { q: "Why do two identical-looking texts have different hashes?", a: "Hashes change completely with any byte difference, including invisible ones such as a trailing space, a different line ending or a non-breaking space." },
  ],
  "url-encoder-decoder": [
    { q: "Why are some characters not encoded?", a: "Letters, digits and a few symbols (- _ . ! ~ * ' ( )) are safe in URLs and are left unchanged by the standard encoding rules." },
    { q: "What happens if I encode text twice?", a: "The % signs are encoded again as %25, producing values like %2520. If you see that in a URL, it was double-encoded; decode it twice to recover the original." },
  ],
  "robots-txt-generator": [
    { q: "Can I block AI crawlers with robots.txt?", a: "Many AI crawlers publish their user-agent names and say they respect robots.txt. Add a group for each user-agent with Disallow: /. Compliance is voluntary, so this is not a guarantee." },
  ],
  "remove-extra-spaces": [
    { q: "Can I remove all line breaks?", a: "Tick “Join broken lines” and “Remove all empty lines” together to turn the whole text into one continuous line with single spaces." },
  ],
  "text-diff-checker": [
    { q: "Is my text compared on a server?", a: "No. The comparison algorithm runs in your browser, so confidential contracts and code never leave your device." },
  ],
  "html-entity-encoder-decoder": [
    { q: "What is the difference between &#39; and &apos;?", a: "Both represent an apostrophe. &apos; is valid in HTML5 and XML but was not defined in HTML4, so &#39; is the most compatible choice." },
  ],
  "json-validator": [
    { q: "Does the validator change my JSON?", a: "No. It only reads your text. Formatting is optional and produced in a separate output box." },
  ],
  "character-counter": [
    { q: "How are line breaks counted?", a: "Each line break counts as one character, which matches how most platforms count them." },
  ],
  "break-even-calculator": [
    { q: "Which period should fixed costs cover?", a: "Use the same period you want the answer for. Monthly fixed costs give monthly break-even units; annual costs give annual units." },
  ],
};
