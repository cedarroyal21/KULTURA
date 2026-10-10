import PatternDivider from "@/components/kultura/PatternDivider";
import WovenProgress from "@/components/kultura/WovenProgress";
import SectionTitle from "@/components/kultura/SectionTitle";
import FcfaPrice from "@/components/kultura/FcfaPrice";

const colors = [
  ["terracotta", "bg-terracotta"],
  ["terracotta-light", "bg-terracotta-light"],
  ["ocre", "bg-ocre"],
  ["indigo", "bg-indigo"],
  ["forest", "bg-forest"],
  ["creme", "bg-creme border"],
  ["sable", "bg-sable"],
  ["encre", "bg-encre"],
];

export default function DesignPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-6">
      <h1 className="font-display text-4xl font-bold text-terracotta">KULTURA — Design system</h1>
      <PatternDivider />

      <section>
        <SectionTitle eyebrow="Couleurs">Palette</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colors.map(([name, cls]) => (
            <div key={name} className="text-sm">
              <div className={`h-16 rounded-2xl ${cls}`} />
              <p className="mt-1">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Typographie">Titres et texte</SectionTitle>
        <p className="font-display text-3xl">Divertir. Découvrir. Apprendre.</p>
        <p className="mt-2">Le texte courant utilise Inter, lisible sur petit écran.</p>
      </section>

      <section>
        <SectionTitle eyebrow="Progression">Bande tissée</SectionTitle>
        <div className="space-y-4">
          <WovenProgress value={80} label="Traditions orales" />
          <WovenProgress value={45} label="Héritage culinaire" />
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Prix">FCFA</SectionTitle>
        <ul className="space-y-1">
          <li><FcfaPrice amount={0} /></li>
          <li><FcfaPrice amount={15000} /></li>
          <li><FcfaPrice amount={25000} memberAmount={15000} /></li>
        </ul>
      </section>

      <PatternDivider />
    </main>
  );
}