import type { ToolContent } from "./types";

const localText =
  "Your text stays in your browser. It is not uploaded, saved or analysed by FreeTools Hub, and it disappears when you close or reload the page.";

export const textContent: Record<string, ToolContent> = {
  "word-counter": {
    intro: [
      "The Word Counter counts words, characters, sentences and paragraphs as you type, and estimates reading and speaking time. A side panel lists your most frequently used words so you can spot repetition.",
      "Words are counted in a language-aware way: contractions such as it's and hyphenated terms such as well-known count as one word, and accented and non-Latin letters are recognised.",
    ],
    why: [
      "Essays, cover letters, abstracts and article briefs often have strict word limits. Bloggers aiming for a particular depth, and speakers timing a talk, also need reliable counts and duration estimates.",
    ],
    steps: [
      "Type or paste your text into the box.",
      "Read the counts in the statistics panel; they update instantly.",
      "Check reading time (238 words per minute) and speaking time (140 words per minute).",
      "Review the most-used words list and toggle whether common words are ignored.",
    ],
    examples: [
      { title: "Scholarship essay limit", body: "If the limit is 650 words and the counter shows 702, use the most-used words list to find repeated phrases you can trim." },
      { title: "Timing a presentation", body: "A 1,050-word script shows a speaking time of about 7 minutes 30 seconds, useful for fitting a 10-minute slot with time for questions." },
    ],
    formats: ["Plain text in any language that separates words with spaces.", "Pasted text from documents, web pages and emails."],
    limitations: [
      "Languages written without spaces between words, such as Chinese, Japanese and Thai, are not segmented into words accurately.",
      "Word processors may count differently for numbers, URLs or symbols such as & and —, so totals can differ by a few words.",
      "Sentence detection relies on punctuation, so abbreviations like “e.g.” may be counted as sentence ends.",
    ],
    privacy: localText,
    faq: [
      { q: "Why does my count differ from Microsoft Word or Google Docs?", a: "Each program uses slightly different rules for hyphens, numbers and symbols. Differences are usually under 1%." },
      { q: "How is reading time calculated?", a: "Words ÷ 238, the average silent reading speed for adults reading English non-fiction reported in a large 2019 meta-analysis. Your own speed may differ." },
      { q: "Does it count words in footnotes I paste?", a: "Yes. Everything in the box is counted, so remove text you do not want included." },
    ],
    related: ["character-counter", "remove-extra-spaces", "case-converter", "text-diff-checker"],
  },

  "character-counter": {
    intro: [
      "The Character Counter shows the number of characters with and without spaces, words, lines and the byte size of your text. Progress bars track common limits — SEO titles, meta descriptions, SMS messages and social posts — and you can add your own limit.",
      "Characters are counted as users perceive them where possible, so an emoji counts as one character rather than two code units.",
    ],
    why: [
      "Platforms truncate or reject text that exceeds their limits. Writing to a limit while seeing a live count avoids awkward cut-offs in search results, ads and social posts.",
    ],
    steps: [
      "Type or paste your text.",
      "Watch the character counts and limit bars update.",
      "Add a custom limit if your platform has a specific one.",
      "Copy your text when it fits.",
    ],
    examples: [
      { title: "Meta description", body: "Draft a description and keep it around 150–160 characters so it is less likely to be truncated in search results." },
      { title: "Database field", body: "A VARCHAR column limited by bytes needs the UTF-8 byte count, which is higher than the character count for accented letters and emoji." },
    ],
    formats: ["Any Unicode text.", "Counts: characters, characters without spaces, words, lines, UTF-8 bytes and UTF-16 code units."],
    limitations: [
      "Platform limits change; the built-in values are common reference points, not official guarantees.",
      "Search engines truncate titles and descriptions by pixel width, so character limits are approximate.",
      "Some complex emoji made of several code points may count as more than one character.",
    ],
    privacy: localText,
    faq: [
      { q: "Do spaces count as characters?", a: "Usually yes. Most platforms count spaces, which is why both figures are shown." },
      { q: "Why do emoji affect SMS length?", a: "Messages containing characters outside the GSM-7 alphabet switch to UCS-2 encoding, which reduces the limit per message from 160 to 70 characters." },
    ],
    related: ["word-counter", "meta-tag-generator", "case-converter", "slug-generator"],
  },

  "case-converter": {
    intro: [
      "The Case Converter changes text between twelve styles: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, alternating case and inverse case.",
      "Title Case follows common style-guide practice by keeping short words such as “of”, “the” and “and” lowercase unless they start the title.",
    ],
    why: [
      "Fixing text accidentally typed with Caps Lock, formatting headings consistently and converting labels into variable or file names are everyday tasks for writers and developers.",
    ],
    steps: [
      "Type or paste text.",
      "Click the case you want; the text is converted in place.",
      "Click another case to convert again, or Reset to start over.",
      "Copy or download the result.",
    ],
    examples: [
      { title: "Fixing Caps Lock", body: "“tHE MEETING IS ON fRIDAY” → Sentence case → “The meeting is on friday”. Proper nouns need a manual touch." },
      { title: "Variable names", body: "“User account ID” → camelCase “userAccountId”, snake_case “user_account_id”, CONSTANT_CASE “USER_ACCOUNT_ID”." },
    ],
    formats: ["Any text, including accented letters."],
    limitations: [
      "Sentence and title case cannot recognise proper nouns or acronyms, so names like “NASA” or “London” may need correcting.",
      "Programming cases drop punctuation and symbols.",
      "Title case rules vary between style guides (APA, Chicago, AP); review important headings.",
    ],
    privacy: localText,
    faq: [
      { q: "What is the difference between camelCase and PascalCase?", a: "camelCase starts with a lowercase letter (myVariable); PascalCase capitalises every word including the first (MyVariable)." },
      { q: "Can I undo a conversion?", a: "Some conversions lose information (for example lowercase). Keep a copy of the original, or use your browser's undo (Ctrl+Z) inside the text box." },
    ],
    related: ["slug-generator", "remove-extra-spaces", "word-counter", "text-repeater"],
  },

  "text-repeater": {
    intro: [
      "The Text Repeater duplicates a word, sentence or block of text up to 10,000 times, joined by a new line, space, comma, nothing or a separator of your choice. Optional numbering adds “1.”, “2.” and so on.",
    ],
    why: [
      "Repeated text is useful for creating test data, filling placeholder content in a layout, checking how an interface handles long input, or preparing practice sheets such as handwriting lines.",
    ],
    steps: [
      "Enter the text to repeat.",
      "Set the repeat count and choose a separator.",
      "Optionally enable numbering.",
      "Click “Repeat text”, then copy or download the result.",
    ],
    examples: [
      { title: "UI stress test", body: "Repeat “Lorem ipsum ” 500 times with no separator to check how a text field or card behaves with very long content." },
      { title: "Practice sheet", body: "Repeat a spelling word 20 times on separate lines with numbering to create a quick practice list." },
    ],
    formats: ["Any text; output limited to 5 million characters."],
    limitations: [
      "The output cap protects your browser from freezing. Very large outputs are previewed partially but copied and downloaded in full.",
      "Please do not use repeated text to spam forms, chats or comment sections; most platforms prohibit it.",
    ],
    privacy: localText,
    faq: [
      { q: "How do I put each repetition on a new line?", a: "Choose “New line” as the separator, or type \\n in a custom separator." },
      { q: "Why is there a 10,000 limit?", a: "To keep the page responsive on all devices. For larger test files, a script is more appropriate." },
    ],
    related: ["case-converter", "word-counter", "remove-extra-spaces", "character-counter"],
  },

  "remove-extra-spaces": {
    intro: [
      "Remove Extra Spaces cleans messy whitespace: double spaces, tabs, spaces at the start or end of lines, repeated blank lines and the broken line endings you get when copying from PDFs. Each clean-up step is a separate option, so you stay in control.",
      "Non-breaking and other unusual Unicode spaces are normalised to regular spaces first.",
    ],
    why: [
      "Text copied from PDFs, websites or emails often contains invisible spacing problems that make documents look untidy and can break data imports or code. Cleaning by hand is slow and error-prone.",
    ],
    steps: [
      "Paste your text into the Original box.",
      "Tick the clean-up options you want; the cleaned text updates instantly.",
      "Use “Join broken lines” for text copied from PDFs, where every line ends with a hard break.",
      "Copy or download the cleaned text.",
    ],
    examples: [
      { title: "PDF paragraph", body: "Lines such as “The results\\nshow a clear\\ntrend.” are joined into “The results show a clear trend.” while blank lines between paragraphs are kept." },
      { title: "Spreadsheet data", body: "Collapse double spaces and trim lines before pasting names into a spreadsheet, so lookups match correctly." },
    ],
    formats: ["Any plain text.", "Handles Windows (CRLF) and Unix (LF) line endings."],
    limitations: [
      "Joining lines cannot tell a deliberate line break (for example in an address or poem) from a PDF wrap; review the result.",
      "Indentation in code will be removed if “Trim spaces” is enabled — disable it for source code.",
    ],
    privacy: localText,
    faq: [
      { q: "Will it remove single spaces between words?", a: "No. Only runs of two or more spaces are collapsed to one." },
      { q: "What are non-breaking spaces?", a: "Special space characters (often from web pages or Word) that look normal but behave differently in searches. The tool converts them to regular spaces." },
    ],
    related: ["word-counter", "case-converter", "text-diff-checker", "character-counter"],
  },

  "text-diff-checker": {
    intro: [
      "The Text Diff Checker compares two versions of text and highlights what was added and removed. Compare line by line for documents and code, or word by word for prose edits, with options to ignore case and whitespace.",
      "It uses a longest-common-subsequence algorithm, the same approach behind many version-control diff tools.",
    ],
    why: [
      "Spotting a changed number in a contract, a reworded sentence in an essay or an edited line in a configuration file is hard by eye. A diff shows every change at once.",
    ],
    steps: [
      "Paste the original version on the left and the changed version on the right.",
      "Choose Lines or Words.",
      "Optionally ignore case or whitespace-only differences.",
      "Click Compare and review the highlighted result.",
    ],
    examples: [
      { title: "Contract revision", body: "Paste the old and new clauses and compare by words to see that “30 days” became “14 days”." },
      { title: "Config change", body: "Compare two versions of a settings file line by line; added lines are marked + and removed lines −." },
    ],
    formats: ["Plain text of any kind, including code.", "Large texts are supported when the differing section is under about 4 million comparison cells (for example 2,000 × 2,000 changed lines)."],
    limitations: [
      "Very long texts that are almost entirely different may exceed the browser comparison limit; compare smaller sections.",
      "Moved blocks appear as a removal plus an addition rather than as a move.",
      "Formatting such as bold or fonts is not compared — only text.",
    ],
    privacy: localText,
    faq: [
      { q: "Can I compare Word or PDF files?", a: "Copy the text out of each document and paste it here. Formatting differences are not detected." },
      { q: "What does “ignore whitespace” do?", a: "Lines that differ only in spacing or indentation are treated as identical." },
    ],
    related: ["remove-extra-spaces", "word-counter", "regex-tester", "json-formatter"],
  },

  "meta-tag-generator": {
    intro: [
      "The Meta Tag Generator produces the HTML head tags a page needs to be described correctly in search results and when shared on social media: title, meta description, robots, canonical URL, Open Graph and Twitter Card tags.",
      "A live preview shows approximately how the title and description could appear in a search result, and length counters help you stay within typical display limits.",
    ],
    why: [
      "Well-written titles and descriptions help searchers understand what a page offers before clicking, and Open Graph tags control the image and text used when someone shares your link. Missing tags lead platforms to guess, often badly.",
    ],
    steps: [
      "Enter a unique, descriptive page title and a meta description summarising the page.",
      "Add the canonical URL and an absolute URL for the share image.",
      "Fill in the site name, optional X/Twitter handle and content type.",
      "Choose whether search engines may index the page and follow its links.",
      "Copy the generated HTML into the <head> of your page.",
    ],
    examples: [
      { title: "Product page", body: "Title “Handmade Ceramic Mugs | Clay & Co.”, a 120–155 character description mentioning what makes the mugs distinctive, og:type “product” and a 1200×630 photo." },
      { title: "Private staging page", body: "Untick “Allow indexing” to generate a noindex robots tag for a page that should not appear in search results." },
    ],
    formats: ["Plain text fields; all values are HTML-escaped in the output.", "Absolute http(s) URLs for canonical and image."],
    limitations: [
      "Meta tags help search engines understand pages but do not guarantee rankings; content quality matters far more.",
      "Google may rewrite titles and descriptions it considers unhelpful.",
      "The preview is an approximation; real search results vary by device and query.",
    ],
    privacy: localText,
    faq: [
      { q: "Does the meta keywords tag help SEO?", a: "No. Google has ignored it for many years, so this generator does not include it." },
      { q: "How long should my title be?", a: "Aim for roughly 30–60 characters so the main message is visible. Put the most important words first." },
      { q: "What image size should I use for Open Graph?", a: "1200×630 pixels is widely supported and displays well on major platforms." },
    ],
    related: ["slug-generator", "robots-txt-generator", "sitemap-xml-generator", "character-counter"],
  },

  "slug-generator": {
    intro: [
      "The Slug Generator converts titles into clean, URL-friendly slugs. It removes accents, replaces “&” with “and”, strips punctuation and joins words with hyphens or underscores. Options include lowercase, stop-word removal and a maximum length that cuts at a word boundary.",
      "A bulk mode converts a whole list of titles at once.",
    ],
    why: [
      "Readable URLs like /blog/reduce-image-file-size are easier to share, remember and understand than /post?id=4821. Consistent slugs also prevent broken links caused by spaces or special characters.",
    ],
    steps: [
      "Type or paste a title.",
      "Choose a separator and options.",
      "Copy the slug shown in the highlighted box.",
      "For many titles, paste them one per line into the bulk box.",
    ],
    examples: [
      { title: "Blog post", body: "“10 Easy Ways to Reduce Image File Size (Without Losing Quality!)” becomes 10-easy-ways-to-reduce-image-file-size-without-losing-quality." },
      { title: "Shorter slug", body: "With stop words removed and a 40-character limit: 10-easy-ways-reduce-image-file-size." },
    ],
    formats: ["Titles in any Latin-script language; accents are transliterated (é → e, ß → ss)."],
    limitations: [
      "Non-Latin scripts such as Arabic, Cyrillic or Chinese are removed rather than transliterated.",
      "Changing the slug of a published page breaks existing links unless you set up a redirect.",
    ],
    privacy: localText,
    faq: [
      { q: "Hyphens or underscores?", a: "Google recommends hyphens to separate words in URLs. Underscores are common for file names in some systems." },
      { q: "Should I remove stop words?", a: "It can make slugs shorter, but keep them when removing them changes the meaning." },
    ],
    related: ["meta-tag-generator", "case-converter", "sitemap-xml-generator", "url-encoder-decoder"],
  },

  "robots-txt-generator": {
    intro: [
      "The Robots.txt Generator builds a correctly formatted robots.txt file with groups of rules for different crawlers, allow and disallow paths, an optional crawl delay and sitemap references.",
      "It warns you about common mistakes, including accidentally blocking your entire site.",
    ],
    why: [
      "robots.txt tells well-behaved crawlers which parts of your site they may request. Keeping crawlers out of admin panels, internal search results and endless filter combinations saves server resources and helps search engines focus on useful pages.",
    ],
    steps: [
      "Edit the default rule group (User-agent: *) or add groups for specific crawlers.",
      "List paths to disallow, one per line, starting with /.",
      "Add allow rules for exceptions inside disallowed folders.",
      "Enter the full URL of your sitemap.",
      "Download robots.txt and upload it to the root of your domain.",
    ],
    examples: [
      { title: "Online shop", body: "Disallow /cart/, /checkout/ and /search to stop crawlers wasting effort on pages with no search value." },
      { title: "Allow an exception", body: "Disallow /private/ but Allow /private/press-kit.pdf to make one file crawlable." },
    ],
    formats: ["Paths starting with / and optional * wildcards and $ end anchors, as supported by major search engines.", "Sitemap lines as absolute URLs."],
    limitations: [
      "robots.txt is a request, not access control. Malicious bots ignore it, and the file itself is public.",
      "Disallowing a page does not guarantee it is removed from search results; use a noindex meta tag on a crawlable page for that.",
      "Google ignores Crawl-delay; set crawl rate preferences in Search Console instead.",
    ],
    privacy: localText,
    faq: [
      { q: "Where do I put robots.txt?", a: "At the root of the host: https://www.example.com/robots.txt. A file in a subfolder is ignored." },
      { q: "What does an empty Disallow mean?", a: "“Disallow:” with no path allows everything for that user-agent." },
    ],
    related: ["sitemap-xml-generator", "meta-tag-generator", "slug-generator", "url-encoder-decoder"],
  },

  "sitemap-xml-generator": {
    intro: [
      "The Sitemap XML Generator turns a list of page URLs into a valid XML sitemap following the sitemaps.org protocol. It validates each URL, removes duplicates, escapes special characters and optionally adds last-modified dates and change frequency.",
    ],
    why: [
      "A sitemap helps search engines discover pages that are not well linked, such as new content or deep pages on a small site. It is especially useful for new websites with few external links.",
    ],
    steps: [
      "Paste your page URLs, one per line, using full https:// addresses.",
      "Optionally add a last-modified date and change frequency.",
      "Review the counters and warnings for invalid lines or mixed domains.",
      "Download sitemap.xml, upload it to your site root and submit it in Google Search Console.",
    ],
    examples: [
      { title: "Small business website", body: "List the home, services, about and contact pages to produce a four-entry sitemap you can submit on launch day." },
      { title: "URLs with parameters", body: "https://example.com/list?page=2&sort=new is escaped as &amp; in the XML automatically." },
    ],
    formats: ["Absolute http/https URLs, one per line, up to 50,000.", "Dates in YYYY-MM-DD format."],
    limitations: [
      "This tool does not crawl your website; you supply the URL list.",
      "Google ignores changefreq and priority values, and uses lastmod only when it is consistently accurate.",
      "Sitemaps larger than 50,000 URLs or 50 MB must be split and listed in a sitemap index.",
    ],
    privacy: localText,
    faq: [
      { q: "Does a sitemap guarantee indexing?", a: "No. It helps discovery, but search engines decide what to index based on quality and other signals." },
      { q: "Should I include every URL?", a: "Include canonical, indexable pages you want in search results. Leave out redirects, duplicates and noindex pages." },
    ],
    related: ["robots-txt-generator", "meta-tag-generator", "slug-generator", "url-encoder-decoder"],
  },
};
