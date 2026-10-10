import type { ReactNode } from "react";

export default function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <header className="mb-4">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-terracotta">{eyebrow}</p>
      )}
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{children}</h2>
      <span className="mt-2 block h-1 w-12 rounded-full bg-ocre" />
    </header>
  );
}