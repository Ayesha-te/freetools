/** ToolSprint logomark: an ink tile with a forward-leaning "T" and two speed lines. Matches /public/icon.svg. */
export default function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="8" fill="#17160f" />
      <path d="M11.62 6.5h17l-1.12 5.1h-17Z" fill="#ff6a2b" />
      <path d="M16.4 11.6h5.2l-3.06 13.9h-5.2Z" fill="#f7f6f2" />
      <path d="M4.04 14.6h9.4l-.66 3h-9.4Z" fill="#ff6a2b" />
      <path d="M5.89 19.8h5.8l-.66 3h-5.8Z" fill="#ff6a2b" />
    </svg>
  );
}
