export interface ToolContent {
  /** What the tool does (1–2 paragraphs). */
  intro: string[];
  /** Why someone would use it. */
  why: string[];
  /** Step-by-step instructions. */
  steps: string[];
  /** Practical, worked examples. */
  examples: { title: string; body: string }[];
  /** Supported formats or inputs. */
  formats: string[];
  /** Honest limitations. */
  limitations: string[];
  /** Tool-specific privacy note. */
  privacy: string;
  faq: { q: string; a: string }[];
  related: string[];
  /** Who benefits from the tool. */
  audience: string[];
  /** Key features actually implemented. */
  features: string[];
}
export type BaseToolContent = Omit<ToolContent, "audience" | "features">;
