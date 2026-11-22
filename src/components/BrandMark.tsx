/** ToolSprint logomark: an ink tile with two forward "sprint" strokes. Matches /public/icon.svg. */
export default function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path d="M10.2 22.5 15.6 9.5h3.1l-5.4 13Z" className="fill-bg" />
      <path d="M16.6 22.5 22 9.5h3.1l-5.4 13Z" className="fill-primary" />
    </svg>
  );
}
