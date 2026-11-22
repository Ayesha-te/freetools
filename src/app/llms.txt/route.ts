import { categories, toolsInCategory, toolHref, categoryHref, tools } from "@/lib/tools/registry";
import { absUrl, site } from "@/lib/site";

export const dynamic = "force-static";

/** /llms.txt: a plain-text map of the site for AI assistants and answer engines (llmstxt.org format). */
export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description} ${tools.length} tools, free, no account. Image and PDF files are processed locally in the browser and never uploaded.`,
    "",
    "## Key facts",
    "",
    `- Free to use, no sign-up and no usage limit.`,
    `- Image, PDF, text and developer tools run entirely in the visitor's browser; files are not uploaded.`,
    `- Calculators show the formula used so results can be checked.`,
    "",
  ];
  for (const c of categories) {
    lines.push(`## ${c.name}`, "", `${c.short}. Overview: ${absUrl(categoryHref(c.slug))}`, "");
    for (const t of toolsInCategory(c.slug)) lines.push(`- [${t.name}](${absUrl(toolHref(t.slug))}): ${t.summary}`);
    lines.push("");
  }
  lines.push(
    "## Optional",
    "",
    `- [About](${absUrl("/about/")}): who runs ${site.name} and how the tools are built`,
    `- [FAQ](${absUrl("/faq/")}): privacy, file limits, browser support`,
    `- [Privacy policy](${absUrl("/privacy-policy/")})`,
    "",
  );
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
