import type { BaseToolContent } from "./types";

const localImage =
  "Your image is decoded and re-encoded by your own browser using the HTML Canvas API. The file is never uploaded to ToolSprint or any other server, and nothing is kept after you close the tab.";

export const imageContent: Record<string, BaseToolContent> = {
  "image-compressor": {
    intro: [
      "The Image Compressor makes JPG, PNG and WebP files smaller by re-encoding them at a quality level you choose. You can also cap the longest side of the image, which is often the single biggest saving for photos taken on modern phones.",
      "After compression you see the original and the new file side by side with their exact sizes, so you can judge whether the visual quality is still acceptable before downloading.",
    ],
    why: [
      "A 12-megapixel phone photo is frequently 3–6 MB. That is far more than a web page, an email or a chat app needs. Large images slow down websites, eat into mobile data allowances and are rejected by many upload forms.",
      "Compressing in the browser is also faster than uploading a large file to an online service and downloading it again, and it keeps personal photos on your device.",
    ],
    steps: [
      "Drag an image onto the upload area or click “choose an image”.",
      "Move the Quality slider. Around 70–80% is a good starting point for photos.",
      "Optionally pick an output format. WebP is usually smallest; JPG has the widest compatibility.",
      "Optionally enter a maximum width/height in pixels, such as 1920 for web use.",
      "Click “Compress image”, compare the before and after previews, then download.",
    ],
    examples: [
      { title: "Shrinking a holiday photo for email", body: "A 4032×3024 JPG of 4.1 MB compressed at 75% quality with a 1600px maximum side typically comes out between 250 and 450 KB. On a phone screen the difference is hard to see, and the email sends instantly." },
      { title: "Optimising a blog header", body: "A PNG screenshot exported from a design tool may be 1.8 MB. Converting it to WebP at 80% often reduces it to under 200 KB, which noticeably improves page load time." },
    ],
    formats: [
      "Input: JPG/JPEG, PNG, WebP, GIF (first frame) and BMP, up to 40 MB and about 50 megapixels.",
      "Output: JPG, WebP or PNG.",
      "Quality applies to JPG and WebP. PNG output is lossless, so only resizing makes it smaller.",
    ],
    limitations: [
      "Re-encoding an image that is already heavily compressed may not make it smaller. The tool tells you when this happens instead of hiding it.",
      "Converting a transparent PNG to JPG fills transparent areas with white, because JPG cannot store transparency.",
      "Embedded metadata such as camera model and GPS location is not carried into the output. This is usually a privacy benefit, but note it if you rely on that data.",
      "Animated GIFs are flattened to their first frame.",
    ],
    privacy: localImage,
    faq: [
      { q: "What quality setting should I use?", a: "For photographs, 70–82% gives a large size reduction with little visible change. For images with sharp text or line art, use 85% or higher, or keep PNG." },
      { q: "Why is my compressed PNG bigger?", a: "PNG is lossless and the browser's PNG encoder is not optimised for size. Choose WebP or JPG output, or reduce the maximum dimensions to get a smaller file." },
      { q: "Does compression remove location data from photos?", a: "Yes. Images are redrawn on a canvas and saved fresh, so EXIF metadata including GPS coordinates is not included in the downloaded file." },
      { q: "Is there a limit on how many images I can compress?", a: "No daily limit. Each image is processed on your device, so the only constraint is your browser's memory." },
    ],
    related: ["compress-image-to-20kb", "compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-200kb"],
  },

  "compress-image-to-50kb": {
    intro: [
      "This tool reduces a photo, scan or signature to 50 KB or less — a limit used by many exam portals, job applications and government services. It searches automatically for the highest quality that still fits under the limit.",
      "If quality reduction alone cannot reach 50 KB, the tool gradually reduces the pixel dimensions too, and it always reports the real final size. If the target truly cannot be met, it says so clearly instead of claiming success.",
    ],
    why: [
      "Online forms often reject uploads above a fixed size with an unhelpful error. Guessing a quality setting in an image editor can take many attempts; this tool does the trial-and-error for you in a second or two.",
      "Because processing happens locally, you can safely use it for passport photos, signatures and ID scans that you would not want to upload to an unknown website.",
    ],
    steps: [
      "Select or drop your photo, signature or document scan.",
      "Leave the target at 50 KB, or change it if your form specifies a slightly different limit (for example 40 KB).",
      "Optionally set a maximum width/height if the form also specifies pixel dimensions.",
      "Click “Compress image”. The tool tests several quality levels and sizes automatically.",
      "Check the result message and preview, then download the file and upload it to your form.",
    ],
    examples: [
      { title: "Exam application photograph", body: "A 3 MB selfie-style portrait usually reaches 45–50 KB at 600–900 pixels wide with good facial detail. If the form requires, say, 350×450 pixels, crop the photo to that ratio with the Image Cropper first, then compress." },
      { title: "Scanned signature", body: "A signature scanned at 300 DPI on white paper compresses extremely well. Expect 10–30 KB at high quality, well under the limit." },
    ],
    formats: [
      "Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.",
      "Output: JPG by default (or WebP if your form accepts it). PNG is not offered because lossless files rarely reach small targets.",
      "Target range: 5 KB to 20,000 KB.",
    ],
    limitations: [
      "Very detailed or noisy photos may need to be reduced in pixel size to fit 50 KB; the tool tells you when dimensions were reduced.",
      "Some forms also require exact dimensions or a white background. This tool controls file size only — use the Cropper and Resizer for dimensions.",
      "1 KB is treated as 1,024 bytes. A few portals use 1,000 bytes; if your upload is rejected by a tiny margin, set the target to 48 KB.",
    ],
    privacy: localImage,
    faq: [
      { q: "Will the image still look clear at 50 KB?", a: "For a passport-style photo at typical web dimensions, yes. The search keeps the highest quality that fits, and only reduces dimensions when absolutely necessary." },
      { q: "Why does the result say it reduced the dimensions?", a: "At the minimum acceptable quality the file was still above 50 KB, so the image was scaled down in steps of about 15% until it fit. The new pixel size is shown." },
      { q: "Can I compress to exactly 50 KB?", a: "Image encoders produce sizes in jumps, so an exact byte count is not achievable. The tool guarantees the file is at or below your target when it reports success." },
      { q: "My form says “between 20 KB and 50 KB”. Will this work?", a: "Yes — the tool aims for the highest quality under the limit, so results are usually close to the upper bound. Check the reported size against the minimum." },
    ],
    related: ["compress-image-to-20kb", "compress-image-to-30kb", "compress-image-to-100kb", "image-cropper"],
  },

  "compress-image-to-100kb": {
    intro: [
      "Compress Image to 100KB brings any photo under a 100 KB ceiling while keeping it as sharp as possible. It uses an automatic search over quality levels and, only if needed, smaller dimensions.",
      "100 KB is a common limit for profile pictures, CV photos, scholarship applications and online marketplace listings. It leaves noticeably more room for detail than 50 KB, so most photos keep their original dimensions.",
    ],
    why: [
      "Manually exporting at different quality levels until a file fits is slow. This tool finds the best setting in one click and tells you the exact final size.",
      "Staying under 100 KB also helps web pages load quickly on mobile connections, which improves user experience for visitors in areas with slower networks.",
    ],
    steps: [
      "Upload the image by dragging it in or clicking “choose an image”.",
      "Keep the 100 KB target or adjust it to match your requirement.",
      "Choose JPG for compatibility or WebP if the destination supports it.",
      "Click “Compress image”. The result shows the final size, quality used and any dimension change.",
      "Download the compressed copy; your original file is untouched.",
    ],
    examples: [
      { title: "Resume headshot", body: "A 2.5 MB portrait from a phone is typically reduced to 90–99 KB at 1200–1600 pixels wide, which is plenty for a CV or LinkedIn-style profile." },
      { title: "Product photo for a listing", body: "A product shot on a plain background compresses efficiently; a 1500×1500 image often fits in 100 KB at 80% quality or higher." },
    ],
    formats: ["Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.", "Output: JPG or WebP.", "Adjustable target from 5 KB to 20,000 KB."],
    limitations: [
      "Images with fine textures (grass, gravel, fabric) compress less efficiently and may require smaller dimensions.",
      "Transparency is lost when saving as JPG; areas become white.",
      "Results depend slightly on your browser, because Chrome, Firefox and Safari use different JPEG encoders.",
    ],
    privacy: localImage,
    faq: [
      { q: "How is this different from the 50KB tool?", a: "The method is identical; only the default target differs. With twice the byte budget, images usually keep full resolution and visibly better detail." },
      { q: "Why do I get a slightly different size in another browser?", a: "Each browser ships its own image encoder. All of them stay under your target when the tool reports success." },
      { q: "Can I go back to the original quality?", a: "Compression is lossy, so detail removed cannot be restored from the compressed copy. Your original file on your device is not changed, so keep it." },
    ],
    related: ["compress-image-to-50kb", "compress-image-to-200kb", "image-compressor", "image-resizer"],
  },

  "compress-image-to-20kb": {
    intro: [
      "Compress Image to 20KB is built for the smallest common upload limit: signature scans, thumbnail photos and other small images on exam, recruitment and banking forms. It tries quality levels automatically and keeps the best one that fits under 20 KB.",
      "20 KB is a tight budget for a photograph, so the tool will often reduce the pixel size as well. Each step is about 15% smaller, and the result always shows the real final size and dimensions, so you know exactly what you are uploading.",
    ],
    why: [
      "Signature fields are where most applicants get stuck: the scan from a phone camera is 1–3 MB and the form wants 20 KB. Doing that by hand in an editor takes many attempts; here it takes one click.",
      "Signatures and ID photos are personal documents. This tool compresses them inside your browser, so they are never sent to a server.",
    ],
    steps: [
      "Scan or photograph your signature on plain white paper, or pick the photo you need to upload.",
      "Crop away empty margins first with the Image Cropper. Less area means more detail fits into 20 KB.",
      "Open the file here. The target is already set to 20 KB; change it if your form allows a different size, such as 10 KB or 15 KB.",
      "Click “Compress image” and check the reported size, quality and dimensions.",
      "Download the result and upload it to your form.",
    ],
    examples: [
      { title: "Signature for an online exam form", body: "A phone photo of a signature on white paper, cropped tightly to the ink, usually fits in 8–18 KB while staying crisp, because large white areas compress very efficiently." },
      { title: "Small passport-style thumbnail", body: "A portrait photo normally needs to be around 300–450 pixels wide to fit 20 KB with acceptable facial detail. The tool reduces the size automatically and tells you the final dimensions." },
    ],
    formats: [
      "Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.",
      "Output: JPG by default, or WebP if your form accepts it.",
      "Target range: 5 KB to 20,000 KB, so the same page works for 10 KB and 15 KB limits too.",
    ],
    limitations: [
      "Detailed colour photos usually have to be made smaller in pixels to reach 20 KB; very large target dimensions and 20 KB are not compatible.",
      "Shadows and grey paper make signature scans compress poorly. Use bright, even light and white paper for the cleanest result.",
      "The tool treats 1 KB as 1,024 bytes. If a portal counts 1,000 bytes and rejects the file by a tiny margin, set the target to 19 KB.",
    ],
    privacy: localImage,
    faq: [
      { q: "Can a photo really be compressed to 20 KB?", a: "Yes, but usually not at full camera resolution. At 20 KB the tool keeps quality as high as it can and reduces the pixel size only as much as needed. The final size and dimensions are shown before you download." },
      { q: "How do I make my signature look sharp at 20 KB?", a: "Crop tightly around the signature, use dark ink on white paper and take the photo in good light. Clean, high-contrast images compress far better than shaded ones." },
      { q: "My form asks for a signature between 10 KB and 20 KB. What target should I use?", a: "Leave the target at 20 KB. The tool aims for the highest quality under the limit, so results usually land close to the upper bound. Check that the reported size is above 10 KB." },
      { q: "Is the file uploaded anywhere?", a: "No. Compression runs in your browser using its built-in image engine, and the file never leaves your device." },
    ],
    related: ["compress-image-to-30kb", "compress-image-to-50kb", "image-cropper", "image-resizer"],
  },

  "compress-image-to-30kb": {
    intro: [
      "Compress Image to 30KB gets a photo or signature under a 30 KB upload limit, a common rule on recruitment, admission and government application portals. It searches for the highest quality that fits and only shrinks the image if it has to.",
      "30 KB gives noticeably more room than 20 KB, so passport-style photos keep clearer faces and signatures stay smooth. The result always shows the exact final size, the quality used and any change in dimensions.",
    ],
    why: [
      "Portals rarely tell you how to meet their limit; they just reject the file. This tool does the trial and error for you and stops at the best result under 30 KB.",
      "Application photos and signatures are personal. Everything happens on your own device, so nothing is uploaded to us or anyone else.",
    ],
    steps: [
      "Choose the photo or signature you need to upload.",
      "If the form specifies dimensions (for example 200×230 pixels), crop or resize to that first.",
      "Keep the 30 KB target, or change it to match the exact limit on your form.",
      "Click “Compress image”. The tool tests quality levels, and smaller sizes if needed.",
      "Check the size shown in the result, then download and upload the file.",
    ],
    examples: [
      { title: "Recruitment form photograph", body: "A 2 MB phone portrait cropped to a head-and-shoulders frame typically fits 30 KB at roughly 450–600 pixels wide with clear facial detail." },
      { title: "Admission form with photo and signature", body: "Compress the photo here at 30 KB, then compress the signature separately with the 20 KB tool if the form gives it a smaller limit." },
    ],
    formats: [
      "Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.",
      "Output: JPG by default, or WebP.",
      "Target range: 5 KB to 20,000 KB.",
    ],
    limitations: [
      "Busy backgrounds and noisy low-light photos use more bytes, so they may be scaled down more. A plain background gives the best result.",
      "This tool controls file size only. If the form also requires an exact pixel size or background colour, use the Cropper and Resizer first.",
      "Different browsers use different JPEG encoders, so the final size can vary slightly between Chrome, Firefox and Safari. It always stays under the target when success is reported.",
    ],
    privacy: localImage,
    faq: [
      { q: "Will my photo still be clear at 30 KB?", a: "For a cropped head-and-shoulders photo, yes. The tool keeps the highest quality that fits and only reduces dimensions when quality alone cannot reach 30 KB." },
      { q: "Why is my result 28 KB instead of exactly 30 KB?", a: "Image encoders produce sizes in steps, so an exact byte count is not possible. The tool picks the best result at or below your limit." },
      { q: "Can I use this for a signature too?", a: "Yes. Signatures on white paper compress very well and usually end up far below 30 KB. If your form needs 20 KB or less, use the 20 KB tool instead." },
    ],
    related: ["compress-image-to-20kb", "compress-image-to-50kb", "image-cropper", "image-compressor"],
  },

  "compress-image-to-200kb": {
    intro: [
      "Compress Image to 200KB brings large phone photos and document scans under a 200 KB limit without making them blurry. With this budget most images keep their full resolution, so text on certificates and ID cards stays readable.",
      "The tool searches for the highest quality that fits under 200 KB and only scales the image down if quality alone is not enough. It reports the final size, quality and dimensions, and says clearly if the target could not be reached.",
    ],
    why: [
      "Many portals that ask for document scans, such as ID cards, certificates and proof of address, cap uploads at 200 KB. A raw phone scan is often 2–5 MB, so it needs compressing before the form will accept it.",
      "Document scans often contain personal details. Because the tool runs in your browser, the scan is never uploaded to a server.",
    ],
    steps: [
      "Photograph or scan the document flat, in good light, and crop away the background.",
      "Open the image here. The target is already 200 KB.",
      "Choose JPG for the widest compatibility, or WebP if the destination supports it.",
      "Click “Compress image” and zoom into the preview to check that small text is still readable.",
      "Download the compressed copy and upload it.",
    ],
    examples: [
      { title: "ID card or certificate scan", body: "A 4 MB phone photo of an A4 certificate usually compresses to 150–200 KB at around 1600–2000 pixels wide, with body text still easy to read." },
      { title: "Photos for a listing or blog post", body: "A 3 MB product or travel photo typically fits 200 KB at 1600 pixels or more at high quality, which looks sharp on screen and loads quickly." },
    ],
    formats: [
      "Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.",
      "Output: JPG or WebP.",
      "Target range: 5 KB to 20,000 KB.",
    ],
    limitations: [
      "Multi-page documents need one image per page. To send several pages as one file, use Image to PDF after compressing.",
      "Transparency is lost when saving as JPG; transparent areas become white.",
      "Very small text photographed from far away may become hard to read at 200 KB. Take the photo closer, or crop to the part that matters.",
    ],
    privacy: localImage,
    faq: [
      { q: "Will the image lose quality at 200 KB?", a: "Usually very little. 200 KB is enough for most photos to keep their full size at high quality, and the tool always picks the best quality that fits." },
      { q: "How do I compress a document scan without making the text blurry?", a: "Crop to the document's edges, take the photo in even light, and keep the JPG output. Then zoom into the preview to check the smallest text before downloading." },
      { q: "Can I compress several images to 200 KB at once?", a: "This tool handles one image at a time so you can check each result. Repeat for each file; it only takes a few seconds per image." },
    ],
    related: ["compress-image-to-100kb", "image-to-pdf", "image-compressor", "image-resizer"],
  },

  "image-resizer": {
    intro: [
      "The Image Resizer changes the pixel width and height of an image. You can type exact dimensions, scale by a percentage, or pick a preset for common social media and video sizes.",
      "Aspect-ratio lock keeps proportions correct so faces and objects are not stretched; unlock it when you deliberately need a specific shape.",
    ],
    why: [
      "Websites, marketplaces and social networks each expect specific image sizes. Uploading a huge image wastes bandwidth and can result in the platform cropping or compressing it badly.",
      "Reducing dimensions is also the most effective way to cut file size: halving width and height leaves roughly a quarter of the pixels.",
    ],
    steps: [
      "Choose an image to resize.",
      "Select “Pixels” to enter width and height, or “Percentage” to scale proportionally.",
      "Keep the chain icon locked to preserve proportions, or pick a preset.",
      "Choose the output format, then click “Resize image”.",
      "Check the new dimensions and file size, then download.",
    ],
    examples: [
      { title: "Website hero image", body: "A 6000×4000 camera photo resized to 1920 pixels wide with the ratio locked becomes 1920×1280 and typically drops from 8 MB to well under 1 MB." },
      { title: "Halving a screenshot", body: "Scaling a 2880×1800 Retina screenshot to 50% gives 1440×900, which displays at the same physical size on standard screens." },
    ],
    formats: ["Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.", "Output: same as original, JPG, PNG or WebP.", "Maximum output: 16,000 pixels per side."],
    limitations: [
      "Enlarging an image cannot create new detail; upscaled images look softer. The tool warns you when you upscale.",
      "Presets set exact dimensions. If the original ratio differs, the image is stretched — crop first for a perfect fit.",
      "Very large outputs may fail on phones with limited memory.",
    ],
    privacy: localImage,
    faq: [
      { q: "Does resizing reduce quality?", a: "Downscaling uses high-quality smoothing and generally looks sharp. JPG and WebP outputs are saved at 92% quality, which is visually close to lossless." },
      { q: "What is the difference between resizing and cropping?", a: "Resizing scales the whole picture to new dimensions. Cropping cuts away parts of the picture and keeps the remaining area at its original scale." },
      { q: "What DPI does the resized image have?", a: "DPI is only a print hint stored in metadata; the browser does not write it. What matters on screen is the pixel size, which you control here." },
    ],
    related: ["image-cropper", "image-compressor", "compress-image-to-100kb", "jpg-to-png"],
  },

  "jpg-to-png": {
    intro: [
      "JPG to PNG converts JPEG photos into the PNG format. You can convert up to 30 files at once and download them individually or together in a ZIP archive.",
      "PNG is a lossless format, so once converted, the image will not lose any further quality when you edit and re-save it.",
    ],
    why: [
      "Some design tools, document templates and older systems require PNG. PNG is also the better format for images you plan to edit repeatedly, add text to, or later make partly transparent.",
      "Converting locally avoids uploading personal photos to a conversion website.",
    ],
    steps: [
      "Drop one or more JPG/JPEG files onto the upload area.",
      "Review the file list; remove any you added by mistake.",
      "Click “Convert to PNG”.",
      "Download each PNG, or use “Download all (ZIP)” for several files.",
    ],
    examples: [
      { title: "Preparing a photo for editing", body: "Convert a JPG to PNG before adding captions in an editor. Each later save of the PNG keeps exactly the pixels you created, without new JPEG artefacts." },
      { title: "Batch converting scanned pages", body: "Ten JPG scans from a phone app can be converted together and downloaded as a single ZIP file." },
    ],
    formats: ["Input: JPG / JPEG files up to 40 MB each, up to 30 at a time.", "Output: PNG (lossless, 8-bit RGBA)."],
    limitations: [
      "Converting cannot restore detail already lost in the original JPG; it only prevents further loss.",
      "PNG files are usually 2–5 times larger than the original JPG. This is normal for a lossless format.",
      "Converting to PNG does not create transparency automatically — the background stays as it is.",
    ],
    privacy: localImage,
    faq: [
      { q: "Why is my PNG much bigger than the JPG?", a: "JPG discards information to save space; PNG stores every pixel exactly. Expect larger files. If size matters more than editing, keep the JPG." },
      { q: "Will the PNG have a transparent background?", a: "No. A JPG has no transparency, so the PNG has the same solid background. Background removal is a separate task." },
      { q: "Are photos rotated correctly?", a: "Yes. Modern browsers apply the camera's orientation tag when decoding, so the PNG is saved the right way up." },
    ],
    related: ["png-to-jpg", "image-compressor", "image-resizer", "image-to-pdf"],
  },

  "png-to-jpg": {
    intro: [
      "PNG to JPG converts PNG images into widely compatible JPEG files with an adjustable quality level. Because JPG has no transparency, you choose the colour used to fill transparent areas.",
      "Batch conversion handles up to 30 files at once with a single ZIP download.",
    ],
    why: [
      "PNG screenshots and exports can be several megabytes. Converting photographic PNGs to JPG commonly cuts the size by 70–90%, making them easier to email, upload or publish.",
      "Some upload forms accept only JPG; this tool makes such images compliant in seconds.",
    ],
    steps: [
      "Add one or more PNG files.",
      "Set the JPG quality (90% is a good default) and choose a background colour for transparent pixels.",
      "Click “Convert to JPG”.",
      "Download individual files or all of them as a ZIP.",
    ],
    examples: [
      { title: "Logo on a coloured background", body: "Converting a transparent logo for a slide with a navy background? Set the background colour to the same navy so the edges blend smoothly instead of showing a white halo." },
      { title: "Reducing screenshot size", body: "A 2.2 MB full-screen PNG screenshot of a photo-heavy web page often becomes 300–500 KB as a 90% JPG." },
    ],
    formats: ["Input: PNG files up to 40 MB each, up to 30 at once.", "Output: JPG with quality 40–100%."],
    limitations: [
      "Transparency cannot be preserved in JPG.",
      "JPG is not ideal for text-heavy screenshots or line art: sharp edges can show faint artefacts. Keep high quality (90%+) for these.",
    ],
    privacy: localImage,
    faq: [
      { q: "What happens to transparent areas?", a: "They are filled with the background colour you choose, white by default." },
      { q: "Which quality should I pick?", a: "85–92% for most images. Lower values make smaller files but may show blockiness around sharp edges and text." },
      { q: "Can I convert JPG back to PNG later?", a: "Yes, with the JPG to PNG tool, but quality lost during JPG compression is not recovered." },
    ],
    related: ["jpg-to-png", "image-compressor", "compress-image-to-100kb", "image-resizer"],
  },

  "image-cropper": {
    intro: [
      "The Image Cropper lets you cut away unwanted parts of an image. Drag the crop box, resize it from any corner, or type exact X, Y, width and height values in pixels.",
      "Aspect-ratio presets such as 1:1, 4:5, 16:9 and a 35:45 passport-style ratio keep the selection the right shape for its destination.",
    ],
    why: [
      "Cropping improves composition, removes distracting backgrounds and prepares images for platforms that require a particular shape, such as square profile pictures or vertical stories.",
      "Application forms often require a specific photo ratio; cropping to that ratio before compressing avoids rejection.",
    ],
    steps: [
      "Upload an image.",
      "Pick an aspect ratio, or keep “Free” for any shape.",
      "Drag inside the box to move it and drag the corner handles to resize. Use the number fields for pixel-exact positions.",
      "Click “Crop image”, review the preview, then download.",
    ],
    examples: [
      { title: "Square profile picture", body: "Choose 1:1, centre the box on the face, crop, then use the Resizer to scale the result to 400×400 pixels." },
      { title: "Removing a screenshot's browser bar", body: "With “Free” ratio, set Y to the height of the toolbar (for example 120 px) and reduce the height by the same amount for a clean capture." },
    ],
    formats: ["Input: JPG, PNG, WebP, GIF and BMP up to 40 MB.", "Output: same format family as input (JPG, PNG or WebP)."],
    limitations: [
      "The 35:45 preset gives the common passport photo shape, but official requirements also cover head size, background and lighting — always check your authority's rules.",
      "Cropping removes pixels; the result has fewer pixels than the original and cannot be enlarged without softness.",
    ],
    privacy: localImage,
    faq: [
      { q: "Can I crop on a phone?", a: "Yes. The crop box supports touch dragging, and the numeric fields work well on small screens." },
      { q: "Does cropping reduce quality?", a: "No resampling is involved: the selected pixels are copied at full resolution. JPG and WebP output is re-encoded at 92% quality." },
      { q: "How do I crop to exact pixel dimensions like 600×600?", a: "Choose 1:1 and type 600 in Width, or crop to the right ratio first and then resize to the exact size." },
    ],
    related: ["image-resizer", "compress-image-to-50kb", "image-compressor", "image-to-pdf"],
  },
};
