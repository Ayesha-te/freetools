import type { ToolContent } from "./types";

const localDev =
  "Everything is processed by JavaScript running in your browser tab. Your input is not sent to a server, logged or stored, so it is safe to use with configuration files and internal data. As always, avoid pasting production secrets into any website you do not control.";

export const developerContent: Record<string, ToolContent> = {
  "json-formatter": {
    intro: [
      "The JSON Formatter pretty-prints JSON with consistent indentation so nested objects and arrays become readable. It can also sort keys alphabetically or minify JSON into a single compact line.",
      "Invalid input is reported with the exact line and column of the problem, plus a hint for common mistakes like trailing commas or single quotes.",
    ],
    why: [
      "API responses and log entries are usually minified, which makes them nearly impossible to read. Formatting reveals the structure instantly. Sorting keys makes two JSON documents easier to compare, and minifying reduces payload size for storage or transport.",
    ],
    steps: [
      "Paste JSON into the input box, or click “Load sample”.",
      "Check the validation message under the box.",
      "Choose 2 spaces, 4 spaces or tabs, and optionally enable key sorting.",
      "Click “Format / beautify” or “Minify”.",
      "Copy the output or download it as a .json file.",
    ],
    examples: [
      { title: "Reading an API response", body: "A one-line response such as {\"user\":{\"id\":7,\"roles\":[\"admin\",\"editor\"]}} becomes an indented tree where you can immediately see that roles is an array inside user." },
      { title: "Preparing a config file", body: "Format with 2 spaces and sorted keys before committing a configuration file, so future diffs only show real changes." },
    ],
    formats: ["Input: standard JSON (RFC 8259) up to about 10 MB.", "Output: formatted or minified JSON, downloadable as .json."],
    limitations: [
      "JSON5, JSONC (with comments) and JavaScript object literals are not valid JSON and will be reported as errors.",
      "Numbers larger than 2^53 lose precision in JavaScript and may be changed when reformatted.",
      "Duplicate keys are collapsed to the last value, as JSON.parse does.",
    ],
    privacy: localDev,
    faq: [
      { q: "Why does it say my JSON is invalid?", a: "The most frequent causes are trailing commas, single-quoted strings, unquoted keys and comments. The error shows the line and column, and a hint names the likely issue." },
      { q: "Does sorting keys change my data?", a: "Only the order of object keys changes. Array order is never changed, and values are untouched." },
      { q: "What is the difference between this and the JSON Validator?", a: "Both use the same parser. The validator focuses on checking and explaining errors as you type; the formatter focuses on producing clean output." },
    ],
    related: ["json-validator", "base64-encoder-decoder", "html-formatter", "url-encoder-decoder"],
  },

  "json-validator": {
    intro: [
      "The JSON Validator checks whether text is valid JSON as you type. When something is wrong, it pinpoints the line and column, shows the offending line with a caret, and suggests the likely fix.",
      "Valid documents get a summary of their structure: the number of objects, arrays and keys and the maximum nesting depth.",
    ],
    why: [
      "A single missing quote can break an entire configuration file or API request, and the error message from an application is often vague. Validating the JSON on its own isolates the problem in seconds.",
    ],
    steps: [
      "Paste or type JSON into the input box.",
      "Watch the status message update in real time.",
      "If invalid, look at the highlighted line and the hint to correct the error.",
      "Once valid, optionally click “Show formatted” to view and copy a clean version.",
    ],
    examples: [
      { title: "Trailing comma", body: "{\"a\": 1, \"b\": 2,} fails because JSON forbids a comma before the closing brace. Remove the final comma." },
      { title: "Single quotes", body: "{'name': 'Ana'} must be written {\"name\": \"Ana\"} — JSON requires double quotes for keys and strings." },
    ],
    formats: ["Standard JSON text.", "Error positions depend on your browser's parser and are usually exact."],
    limitations: [
      "Validation checks syntax only. It does not check your data against a JSON Schema.",
      "Comments and trailing commas, allowed in JSON5 and some config formats, are reported as errors.",
    ],
    privacy: localDev,
    faq: [
      { q: "Is an empty object valid JSON?", a: "Yes. {}, [], \"text\", 42, true and null are all valid JSON documents." },
      { q: "Can I validate against a schema?", a: "Not yet. This tool checks syntax. Schema validation would require your schema and is a different task." },
    ],
    related: ["json-formatter", "regex-tester", "base64-encoder-decoder", "html-entity-encoder-decoder"],
  },

  "base64-encoder-decoder": {
    intro: [
      "This tool converts text to Base64 and back with full UTF-8 support, so accented letters, non-Latin scripts and emoji round-trip correctly. A URL-safe option replaces + and / with - and _ for use in URLs and tokens.",
      "You can also encode any file into Base64 or a data URI for embedding small images or fonts directly into HTML and CSS.",
    ],
    why: [
      "Base64 is used in email attachments, data URIs, HTTP Basic authentication headers and JSON Web Tokens. Developers often need to inspect or create Base64 values while debugging.",
      "Many online encoders mishandle non-ASCII characters; this one encodes text as UTF-8 bytes first, which is what servers expect.",
    ],
    steps: [
      "Choose Encode or Decode.",
      "Type or paste your input; the result appears immediately.",
      "For encoding, tick URL-safe if the result will go into a URL or token.",
      "Copy the result, or download decoded binary data as a file.",
      "To encode a file, use the lower panel and copy either raw Base64 or a full data URI.",
    ],
    examples: [
      { title: "Decoding a JWT segment", body: "The middle part of a JSON Web Token is URL-safe Base64. Paste it into Decode to read the JSON claims (the signature is not verified)." },
      { title: "Inline SVG icon", body: "Encode a small SVG file and paste the data URI into a CSS background-image to avoid an extra HTTP request." },
    ],
    formats: ["Text input of any length that fits in memory.", "Files up to 10 MB for encoding.", "Standard and URL-safe alphabets; padding is optional when decoding."],
    limitations: [
      "Base64 is an encoding, not encryption. Anyone can decode it.",
      "Encoded output is about 33% larger than the original data.",
    ],
    privacy: localDev,
    faq: [
      { q: "Is Base64 secure?", a: "No. It only changes representation. Do not use it to protect passwords or secrets." },
      { q: "What is URL-safe Base64?", a: "A variant that uses - and _ instead of + and / and often drops = padding, so the value can appear in URLs and file names without escaping." },
      { q: "Why does decoding show strange characters?", a: "The data is probably binary (for example an image) rather than text. Use “Download as file” instead." },
    ],
    related: ["url-encoder-decoder", "hash-generator", "html-entity-encoder-decoder", "json-formatter"],
  },

  "url-encoder-decoder": {
    intro: [
      "The URL Encoder/Decoder converts text to and from percent-encoding, the format used to put spaces and special characters safely into URLs. It supports both encodeURIComponent rules (for query values) and encodeURI rules (for complete URLs), plus form-style + for spaces.",
      "When the decoded text is a full URL, its query parameters are listed in a table.",
    ],
    why: [
      "Unescaped characters such as &, = and # break query strings, and non-ASCII characters must be encoded as UTF-8. Decoding is equally useful for reading tracking links and redirect URLs.",
    ],
    steps: [
      "Choose Encode or Decode.",
      "When encoding, choose the rules: component for a single value, full URL to keep the URL structure.",
      "Paste your text and copy the result.",
      "Tick the + option if you are working with HTML form data.",
    ],
    examples: [
      { title: "Search query parameter", body: "café & croissants encodes as caf%C3%A9%20%26%20croissants, so the & is not mistaken for a parameter separator." },
      { title: "Reading a redirect link", body: "Decode https%3A%2F%2Fexample.com%2Fpage%3Fid%3D5 to see the destination https://example.com/page?id=5." },
    ],
    formats: ["UTF-8 text input.", "Percent-encoded input (%XX sequences)."],
    limitations: [
      "Malformed sequences such as %E0%A4 without the final byte cannot be decoded; the tool explains the error.",
      "This tool does not punycode-encode international domain names.",
    ],
    privacy: localDev,
    faq: [
      { q: "encodeURI or encodeURIComponent?", a: "Use component rules for any single piece you insert into a URL (a parameter value, a path segment). Use full-URL rules only for a complete URL that already has its structure." },
      { q: "Should spaces be %20 or +?", a: "%20 is correct everywhere. + means space only in application/x-www-form-urlencoded data, such as HTML form submissions." },
    ],
    related: ["base64-encoder-decoder", "html-entity-encoder-decoder", "slug-generator", "json-formatter"],
  },

  "uuid-generator": {
    intro: [
      "The UUID Generator creates random version 4 UUIDs (also called GUIDs) using your browser's cryptographically secure random number generator. Generate one or up to 1,000 at a time and format them in lowercase, uppercase, without hyphens or wrapped in braces.",
    ],
    why: [
      "UUIDs are used as database keys, request IDs, file names and test fixtures because they can be created independently on any machine with a negligible chance of collision.",
    ],
    steps: [
      "Enter how many UUIDs you need.",
      "Click Generate.",
      "Adjust formatting options; the list updates without generating new values.",
      "Copy all or download them as a text file.",
    ],
    examples: [
      { title: "Seeding test data", body: "Generate 100 UUIDs and paste them into a CSV to give each test record a unique ID." },
      { title: "Windows registry style", body: "Tick Uppercase and braces to get the {XXXXXXXX-XXXX-…} form used by some Microsoft tools." },
    ],
    formats: ["Output: RFC 4122 / RFC 9562 version 4 UUIDs, 1 to 1,000 per batch."],
    limitations: ["Only version 4 (random) UUIDs are generated. Time-ordered versions such as v7 are not currently offered."],
    privacy: "UUIDs are generated locally with crypto.randomUUID or crypto.getRandomValues. They are not sent anywhere or recorded, so no one else knows which IDs you generated.",
    faq: [
      { q: "Can two UUIDs ever be the same?", a: "In theory yes, but with 122 random bits the probability is so small that it can be ignored for practical purposes." },
      { q: "Are these UUIDs safe to use as secrets?", a: "They are generated from a secure random source, but UUIDs are designed as identifiers. Use dedicated token generation for security tokens." },
    ],
    related: ["hash-generator", "timestamp-converter", "base64-encoder-decoder", "json-formatter"],
  },

  "html-formatter": {
    intro: [
      "The HTML Formatter re-indents HTML so every element appears on its own line with consistent nesting. Inline elements such as links and bold text stay within their line, while the contents of pre, textarea, script and style are preserved.",
      "A minify mode does the opposite, removing comments and unnecessary whitespace.",
    ],
    why: [
      "Minified or machine-generated HTML is hard to debug. Indented markup reveals unclosed tags and incorrect nesting, and makes code reviews of templates far easier.",
    ],
    steps: [
      "Paste your HTML, or click “Load sample”.",
      "Choose the indentation.",
      "Click “Format HTML” or “Minify”.",
      "Copy the result or download it as an .html file.",
    ],
    examples: [
      { title: "Inspecting an email template", body: "Paste a one-line HTML email to see its table structure laid out clearly." },
      { title: "Cleaning CMS output", body: "Format HTML exported from a page builder before editing it by hand." },
    ],
    formats: ["HTML documents or fragments up to 5 MB."],
    limitations: [
      "The formatter re-indents tags; it does not fix invalid HTML or auto-close missing tags.",
      "Embedded JavaScript and CSS are re-indented as blocks but not reformatted internally.",
      "Minifying collapses whitespace between some elements, which can occasionally change spacing between inline-block elements.",
    ],
    privacy: localDev + " The HTML is treated purely as text and is never rendered or executed.",
    faq: [
      { q: "Will formatting change how my page looks?", a: "Formatting adds whitespace between block elements, which browsers ignore. Text inside inline elements and pre blocks is kept as-is." },
      { q: "Does it validate HTML?", a: "No. Use the W3C Markup Validation Service for standards validation." },
    ],
    related: ["html-entity-encoder-decoder", "json-formatter", "meta-tag-generator", "url-encoder-decoder"],
  },

  "html-entity-encoder-decoder": {
    intro: [
      "This tool escapes characters that have special meaning in HTML — such as <, >, & and quotes — into entities like &lt; and &amp;, and decodes named and numeric entities back into readable text.",
      "Optionally, non-ASCII characters can be converted into named entities (&eacute;) or numeric entities (&#233;).",
    ],
    why: [
      "Showing code examples on a web page, inserting user-provided text into HTML, or reading text scraped from a page all require correct entity handling. Getting it wrong can break layouts or open cross-site scripting holes.",
    ],
    steps: [
      "Choose Encode or Decode.",
      "When encoding, decide how to treat non-ASCII characters and whether to escape quotes.",
      "Paste text and copy the result.",
    ],
    examples: [
      { title: "Displaying code in a blog post", body: "<div class=\"box\"> becomes &lt;div class=&quot;box&quot;&gt;, which displays literally instead of creating a div." },
      { title: "Cleaning scraped text", body: "Fish &amp; Chips &#8212; &pound;9 decodes to Fish & Chips — £9." },
    ],
    formats: ["Named entities for common symbols and accented letters.", "Decimal (&#169;) and hexadecimal (&#xA9;) numeric entities for any Unicode character."],
    limitations: [
      "The decoder includes the most common named entities, not all 2,000+ defined in HTML5. Unknown names are left unchanged.",
      "Escaping text is not a complete XSS defence; use your framework's templating, which escapes automatically, wherever possible.",
    ],
    privacy: localDev,
    faq: [
      { q: "Do I need to encode é or € on a UTF-8 page?", a: "No. Modern pages declared as UTF-8 can include these characters directly. Only <, >, & and quotes in attributes must be escaped." },
      { q: "Is the decoded output rendered?", a: "No. It is displayed as plain text in a text box, so any markup it contains cannot execute." },
    ],
    related: ["html-formatter", "url-encoder-decoder", "base64-encoder-decoder", "meta-tag-generator"],
  },

  "timestamp-converter": {
    intro: [
      "The Timestamp Converter turns Unix epoch timestamps into human-readable dates in UTC and your local time zone, and converts dates back into timestamps. It detects automatically whether a value is in seconds or milliseconds.",
      "The current Unix time is shown live at the top for quick reference.",
    ],
    why: [
      "Databases, APIs and log files store time as seconds or milliseconds since 1 January 1970 UTC. Converting these numbers is constant work when debugging scheduling bugs, expired tokens or event ordering.",
    ],
    steps: [
      "Enter a timestamp in the first panel; leave Unit on Auto-detect unless the guess is wrong.",
      "Read the UTC ISO date, your local date, the HTTP date format and a relative description.",
      "To go the other way, pick a date and time in the second panel and choose whether it is local time or UTC.",
      "Copy any value with its Copy button.",
    ],
    examples: [
      { title: "Checking token expiry", body: "A JWT has \"exp\": 1767225600. Converting shows 2026-01-01T00:00:00.000Z, so the token expires at midnight UTC on New Year's Day 2026." },
      { title: "Milliseconds from JavaScript", body: "Date.now() returns values like 1763700000000. Auto-detect recognises 13-digit values as milliseconds." },
    ],
    formats: ["Integer or decimal timestamps in seconds or milliseconds.", "Dates from about 271,821 BC to AD 275,760 (the JavaScript Date range)."],
    limitations: [
      "Unix time does not count leap seconds, matching how almost all systems behave.",
      "Auto-detection treats values of 100 billion or more as milliseconds. Very distant dates in seconds may need the unit set manually.",
    ],
    privacy: localDev,
    faq: [
      { q: "What is the Unix epoch?", a: "00:00:00 UTC on 1 January 1970. Unix time counts the seconds elapsed since then." },
      { q: "What is the year 2038 problem?", a: "Systems storing Unix time as a signed 32-bit integer overflow on 19 January 2038. Modern 64-bit systems are not affected." },
      { q: "Why does local time differ from UTC?", a: "Local time applies your device's time-zone offset and daylight saving rules; UTC never changes with seasons." },
    ],
    related: ["uuid-generator", "json-formatter", "regex-tester", "hash-generator"],
  },

  "regex-tester": {
    intro: [
      "The Regex Tester runs JavaScript regular expressions against your sample text, highlighting every match and listing capture groups and named groups. You can toggle flags and preview the result of a replacement.",
      "Patterns run inside a Web Worker with a two-second time limit, so a pattern with catastrophic backtracking is stopped safely instead of freezing your browser.",
    ],
    why: [
      "Regular expressions are compact but easy to get wrong. Seeing matches highlighted live while you edit a pattern is the fastest way to build and debug one before putting it into code.",
    ],
    steps: [
      "Type a pattern without the surrounding slashes.",
      "Tick the flags you need (g for all matches, i for case-insensitive, m for multi-line anchors, and so on).",
      "Paste test text; matches are highlighted automatically.",
      "Inspect the table of match positions and groups.",
      "Optionally tick “Test a replacement” and use $1, $2 or $<name> to reference groups.",
    ],
    examples: [
      { title: "Finding email-like strings", body: "\\b(\\w+)@(\\w+)\\.com\\b with flags gi finds alice@example.com and BOB@test.com, capturing the user and domain separately." },
      { title: "Reformatting dates", body: "Pattern (\\d{4})-(\\d{2})-(\\d{2}) with replacement $3/$2/$1 turns 2026-11-21 into 21/11/2026." },
    ],
    formats: ["JavaScript (ECMAScript) regular expression syntax, including lookbehind and named groups in modern browsers.", "Test text up to 1,000,000 characters; up to 5,000 matches listed."],
    limitations: [
      "Syntax is JavaScript's. Some PCRE, Python or .NET features (possessive quantifiers, recursion, inline modifiers in older browsers) are not supported.",
      "Results reflect the regex engine of the browser you are using.",
    ],
    privacy: localDev,
    faq: [
      { q: "Why did my pattern time out?", a: "Nested quantifiers such as (a+)+ can take exponential time on certain inputs. Make quantifiers more specific or use anchors." },
      { q: "Why do I only get one match?", a: "Without the g (global) flag, JavaScript stops after the first match. Tick g to find all matches." },
    ],
    related: ["json-validator", "text-diff-checker", "url-encoder-decoder", "remove-extra-spaces"],
  },

  "hash-generator": {
    intro: [
      "The Hash Generator computes MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests for text or files. SHA hashes use your browser's built-in Web Crypto API; MD5, which Web Crypto does not provide, uses a small tested JavaScript implementation.",
      "Paste a published checksum into the compare box to verify a download in one step.",
    ],
    why: [
      "Software publishers list checksums so you can confirm a file was not corrupted or tampered with. Developers also use hashes for cache keys, deduplication and comparing data without revealing it.",
    ],
    steps: [
      "Choose Text or File.",
      "Type text (hashes update as you type) or select a file.",
      "Copy the hash you need.",
      "Optionally paste an expected checksum to see whether it matches any algorithm.",
    ],
    examples: [
      { title: "Verifying a download", body: "Select the installer you downloaded, paste the SHA-256 value from the vendor's website, and look for a green “Match” message." },
      { title: "Known test value", body: "The SHA-256 of the text abc is ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad." },
    ],
    formats: ["Text encoded as UTF-8.", "Files up to 200 MB (MD5 up to 50 MB).", "Lowercase or uppercase hexadecimal output."],
    limitations: [
      "MD5 and SHA-1 are broken for security purposes; use them only for compatibility or non-security checksums.",
      "Plain hashes are not suitable for storing passwords. Use a password hashing function such as Argon2, scrypt or bcrypt.",
      "Text hashes depend on exact bytes: different line endings (CRLF vs LF) give different results.",
    ],
    privacy: "Text and files are hashed locally using the Web Crypto API. Nothing is uploaded, so you can safely check private files.",
    faq: [
      { q: "Which algorithm should I use?", a: "SHA-256 is the modern default for integrity checks. Use whatever algorithm the publisher lists when verifying a download." },
      { q: "Can a hash be reversed?", a: "Not directly. However, short or common inputs can be found by guessing, which is why plain hashes are unsafe for passwords." },
    ],
    related: ["base64-encoder-decoder", "uuid-generator", "text-diff-checker", "json-formatter"],
  },
};
