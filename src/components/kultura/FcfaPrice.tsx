import { fcfa } from "@/lib/format";

export default function FcfaPrice({ amount, memberAmount }: { amount: number; memberAmount?: number }) {
  if (amount === 0) return <span className="font-semibold text-forest">Gratuit</span>;
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={memberAmount != null ? "text-sm text-encre/50 line-through" : "font-semibold"}>
        {fcfa(amount)}
      </span>
      {memberAmount != null && (
        <span className="font-semibold text-terracotta">{fcfa(memberAmount)}</span>
      )}
    </span>
  );
}