// Motif inspiré des bandes géométriques du Ndop (tissu bamiléké) : losanges et points.
export default function PatternDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" role="presentation" className={`h-4 w-full text-indigo ${className}`}>
      <defs>
        <pattern id="kultura-ndop" width="24" height="16" patternUnits="userSpaceOnUse">
          <path d="M12 2 L18 8 L12 14 L6 8 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="8" r="1.6" fill="currentColor" />
          <path d="M0 8h3M21 8h3" stroke="currentColor" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kultura-ndop)" />
    </svg>
  );
}