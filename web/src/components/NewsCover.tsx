// Copertina editoriale generata per ogni notizia: fondo a strati (gradiente +
// aloni luminosi + griglia + vignetta) e un grande simbolo a tema con bagliore.
// Deterministica dal titolo. Tutto inline e vettoriale: nessuna richiesta esterna,
// nessun problema di CSP o copyright, aspect-ratio 16:9 fisso (zero layout shift).

type Topic = "justice" | "funds" | "city" | "money" | "data";

// Palette coerente per tema (colore principale + secondario).
const PALETTE: Record<Topic, [string, string]> = {
  justice: ["#ff5b6e", "#f472b6"],
  funds: ["#818cf8", "#22d3ee"],
  city: ["#22d3ee", "#818cf8"],
  money: ["#34d399", "#22d3ee"],
  data: ["#38bdf8", "#c084fc"],
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function topicOf(title: string): Topic {
  const t = title.toLowerCase();
  if (/corte dei conti|tribunal|sentenz|condann|corruz|corrup|pecul|malversa|fraud|frode|arrest|detenid|indagin|inchiest|reato|tangent|cohecho|interdiz|inhabilita|sanci[oó]n|sanzion|delitt/.test(t))
    return "justice";
  if (/fond[oi]|fondos|pnrr|europe|\bue\b|subvenc|sovvenz|appalt|adjudicaci|contrat|\bgara\b|next generation/.test(t)) return "funds";
  if (/comune|ayuntamiento|municip|sindac|alcalde|giunta|consigl|concejal|diputaci|provincia/.test(t)) return "city";
  if (/spesa|spese|gasto|bilancio|presupuesto|mili[oó]n|milion|debit|deuda|tass|impost|entrate|ingres|despilfarro|sprec|sobrecoste|tributi/.test(t))
    return "money";
  return "data";
}

// Simboli grandi e pieni (path), centrati in una cella 0..100, da scalare.
function Motif({ topic, c1, gradId }: { topic: Topic; c1: string; gradId: string }) {
  const common = { fill: `url(#${gradId})`, stroke: c1, strokeWidth: 1.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (topic) {
    case "justice":
      return (
        <g {...common}>
          <rect x="48.5" y="20" width="3" height="62" rx="1.5" />
          <circle cx="50" cy="17" r="4" />
          <path d="M50 24 L18 33 M50 24 L82 33" stroke={c1} strokeWidth="2.4" fill="none" />
          <path d="M18 33 L8 56 a14 9 0 0 0 20 0 Z" />
          <path d="M82 33 L72 56 a14 9 0 0 0 20 0 Z" />
          <rect x="34" y="82" width="32" height="5" rx="2.5" />
        </g>
      );
    case "money":
      return (
        <g {...common}>
          <path d="M64 28 a26 26 0 1 0 0 44 a22 22 0 1 1 0 -44 Z" />
          <rect x="22" y="42" width="40" height="6" rx="3" />
          <rect x="22" y="54" width="34" height="6" rx="3" />
          <circle cx="78" cy="78" r="9" fill="none" stroke={c1} strokeWidth="2.2" />
          <circle cx="22" cy="80" r="7" fill="none" stroke={c1} strokeWidth="2" />
        </g>
      );
    case "funds":
      return (
        <g {...common}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * 38;
            const y = 50 + Math.sin(a) * 38;
            return <circle key={i} cx={x} cy={y} r="3.2" />;
          })}
          <path d="M62 34 a18 18 0 1 0 0 32 a15 15 0 1 1 0 -32 Z" />
          <rect x="33" y="44" width="26" height="4.5" rx="2.25" />
          <rect x="33" y="53" width="22" height="4.5" rx="2.25" />
        </g>
      );
    case "city":
      return (
        <g {...common}>
          <rect x="14" y="50" width="20" height="36" rx="2" />
          <rect x="40" y="32" width="22" height="54" rx="2" />
          <rect x="68" y="44" width="20" height="42" rx="2" />
          <g fill="#05070f" stroke="none" opacity="0.55">
            {[18, 24, 30].map((x) => [56, 64, 72].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="3" height="4" />))}
            {[45, 51, 57].map((x) => [40, 48, 56, 64, 72].map((y) => <rect key={`b${x}-${y}`} x={x} y={y} width="3" height="4" />))}
          </g>
          <path d="M51 22 L51 32" stroke={c1} strokeWidth="2.4" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <rect x="20" y="58" width="13" height="26" rx="2" />
          <rect x="40" y="40" width="13" height="44" rx="2" />
          <rect x="60" y="26" width="13" height="58" rx="2" />
          <path d="M20 52 L46 36 L66 44 L86 18" fill="none" stroke={c1} strokeWidth="2.6" />
          <circle cx="86" cy="18" r="3.4" />
        </g>
      );
  }
}

export default function NewsCover({ title }: { title: string }) {
  const h = hashStr(title);
  const topic = topicOf(title);
  const [c1, c2] = PALETTE[topic];
  const id = `cc${h % 100000}`;
  // Variación de posición de los halos según el hash (para que no sean idénticos).
  const ox = 60 + (h % 40);
  const oy = 20 + ((h >> 3) % 30);

  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto block" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1020" />
          <stop offset="1" stopColor="#05070f" />
        </linearGradient>
        <radialGradient id={`${id}o1`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c1} stopOpacity="0.55" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}o2`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c2} stopOpacity="0.45" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}vig`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#05070f" stopOpacity="0" />
          <stop offset="1" stopColor="#05070f" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id={`${id}motif`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} stopOpacity="0.95" />
          <stop offset="1" stopColor={c2} stopOpacity="0.85" />
        </linearGradient>
        <filter id={`${id}glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>

      <rect width="320" height="180" fill={`url(#${id}bg)`} />
      <circle cx={ox * 3.2} cy={oy * 1.8} r="150" fill={`url(#${id}o1)`} />
      <circle cx={320 - ox * 2.2} cy={170} r="130" fill={`url(#${id}o2)`} />

      {/* griglia tenue */}
      <g stroke={c2} strokeOpacity="0.08" strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="180" />
        ))}
        {[45, 90, 135].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} />
        ))}
      </g>

      {/* simbolo: alone sfocato + versione nitida sopra */}
      <g transform="translate(160 90) scale(1.55) translate(-50 -50)">
        <g filter={`url(#${id}glow)`} opacity="0.85">
          <Motif topic={topic} c1={c1} gradId={`${id}motif`} />
        </g>
        <Motif topic={topic} c1={c1} gradId={`${id}motif`} />
      </g>

      <rect width="320" height="180" fill={`url(#${id}vig)`} />
    </svg>
  );
}
