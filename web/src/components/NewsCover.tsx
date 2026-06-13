// Copertina vettoriale generata per ogni notizia: gradiente + icona a tema + glow.
// Deterministica dal titolo (stesso titolo → stessa copertina). Tutto inline:
// nessuna richiesta esterna, nessun problema di CSP o copyright, e l'aspect-ratio
// 16:9 fisso (viewBox) evita qualunque layout shift.

const PALETTE: Record<string, string> = {
  cyan: "#22d3ee",
  violet: "#818cf8",
  magenta: "#f472b6",
  green: "#34d399",
  amber: "#fbbf24",
};
const THEMES: [string, string][] = [
  [PALETTE.cyan, PALETTE.violet],
  [PALETTE.violet, PALETTE.magenta],
  [PALETTE.green, PALETTE.cyan],
  [PALETTE.amber, PALETTE.magenta],
];

// Icone in stile Lucide (stroke), nessuna emoji.
const ICONS: Record<string, React.ReactNode> = {
  court: (
    <>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </>
  ),
  city: (
    <>
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </>
  ),
  money: (
    <>
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
    </>
  ),
  data: (
    <>
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </>
  ),
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function topicOf(title: string): keyof typeof ICONS {
  const t = title.toLowerCase();
  if (/corte dei conti|tribunal|fiscal|auditor|indagin|inchiest|condann|fraud|corru|sentenz|procur/.test(t)) return "court";
  if (/comune|ayuntamiento|municipi|alcalde|sindac|giunta|consigli|concejal|diputaci/.test(t)) return "city";
  if (/bilancio|presupuesto|gasto|spesa|spese|mill[oó]n|milion|fond[oi]|deuda|debit|tass|impost|ingres|entrate|investiment|inversi/.test(t)) return "money";
  return "data";
}

export default function NewsCover({ title }: { title: string }) {
  const h = hashStr(title);
  const [c1, c2] = THEMES[h % THEMES.length];
  const topic = topicOf(title);
  const gid = `nc${h % 100000}`;
  return (
    <svg
      viewBox="0 0 320 180"
      className="w-full h-auto block"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} stopOpacity="0.32" />
          <stop offset="1" stopColor={c2} stopOpacity="0.16" />
        </linearGradient>
        <radialGradient id={`${gid}r`} cx="0.78" cy="0.18" r="0.85">
          <stop offset="0" stopColor={c1} stopOpacity="0.5" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="#0a0e1c" />
      <rect width="320" height="180" fill={`url(#${gid})`} />
      <rect width="320" height="180" fill={`url(#${gid}r)`} />
      <g stroke={c2} strokeOpacity="0.1" strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="180" />
        ))}
        {[45, 90, 135].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} />
        ))}
      </g>
      <g
        transform="translate(160 90) scale(3.4) translate(-12 -12)"
        fill="none"
        stroke={c1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 5px ${c1})` }}
      >
        {ICONS[topic]}
      </g>
    </svg>
  );
}
