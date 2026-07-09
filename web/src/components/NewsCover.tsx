// Copertina della notizia: immagine AI ad alto impatto (generata con Pollinations,
// self-hosted in /public/covers → servita da 'self', nessun problema di CSP né
// dipendenza a runtime). Tema scelto dalle parole chiave del titolo; 3 varianti
// per tema, scelte in modo deterministico dall'hash del titolo (varietà stabile).

type Topic = "justice" | "waste" | "money" | "city" | "funds" | "data";
const VARIANTS = 3;

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function topicOf(title: string): Topic {
  const t = title.toLowerCase();
  if (/corte dei conti|tribunal|sentenz|condann|corruz|corrup|pecul|malversa|fraud|frode|arrest|detenid|indagin|inchiest|reato|tangent|cohecho|interdiz|inhabilita|sanci[oó]n|sanzion|delitt|enchuf|parentopoli|nepotism|clientel/.test(t))
    return "justice";
  if (/despilfarro|sprec|spreco|sobrecoste|sovrapprezz|"a dedo"|consulenze|gasto injustificado|spesa ingiustificata|spesa folle/.test(t))
    return "waste";
  if (/fond[oi]|fondos|pnrr|europe|\bue\b|subvenc|sovvenz|appalt|adjudicaci|contrat|\bgara\b|next generation/.test(t)) return "funds";
  if (/comune|ayuntamiento|municip|sindac|alcalde|giunta|consigl|concejal|diputaci|provincia/.test(t)) return "city";
  if (/spesa|spese|gasto|bilancio|presupuesto|mili[oó]n|milion|debit|deuda|tass|impost|entrate|ingres|tributi|soldi|dinero/.test(t))
    return "money";
  return "data";
}

export default function NewsCover({ title }: { title: string }) {
  const topic = topicOf(title);
  const variant = (hashStr(title) % VARIANTS) + 1;
  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0a0e1c]">
      <img
        src={`/covers/${topic}-${variant}.jpg`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
      />
      {/* velo scuro in basso per la leggibilità di badge/fonte sovrapposti */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070f]/85 via-[#05070f]/15 to-[#05070f]/25" />
    </div>
  );
}
