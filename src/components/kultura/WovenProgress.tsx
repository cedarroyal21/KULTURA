type Props = { value: number; label?: string; className?: string };

export default function WovenProgress({ value, label, className = "" }: Props) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex justify-between text-xs font-medium text-encre/70">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progression"}
        className="h-3 w-full overflow-hidden rounded-full bg-sable"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundImage:
              "repeating-linear-gradient(45deg, #943d1e 0 6px, #cca730 6px 12px)",
          }}
        />
      </div>
    </div>
  );
}