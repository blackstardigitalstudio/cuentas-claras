// Claro — la mascota de Cuentas Claras: una chispa de luz que "aclara" las
// cuentas. SVG propio (sin dependencias), tamaño configurable. `wave` levanta
// el bracito. Colores de marca (cian/violeta neón).

export default function Mascot({ size = 96, wave = false, className = "" }: { size?: number; wave?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} role="img" aria-label="Claro, la mascota de Cuentas Claras">
      <defs>
        <radialGradient id="mBody" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#7ff0ff" />
          <stop offset="0.55" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7c5cff" />
        </radialGradient>
        <linearGradient id="mSpark" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#eafcff" />
        </linearGradient>
        <radialGradient id="mGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(34,211,238,0.55)" />
          <stop offset="1" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
      </defs>

      {/* halo */}
      <circle cx="60" cy="60" r="52" fill="url(#mGlow)" />
      {/* sombra */}
      <ellipse cx="60" cy="104" rx="26" ry="5" fill="rgba(0,0,0,0.35)" />

      {/* chispa / mechón */}
      <path d="M60 8 C 66 22, 72 26, 60 34 C 48 26, 54 22, 60 8 Z" fill="url(#mSpark)" />

      {/* cuerpo */}
      <circle cx="60" cy="64" r="34" fill="url(#mBody)" stroke="rgba(234,252,255,0.5)" strokeWidth="1.5" />
      {/* brillo del cuerpo */}
      <ellipse cx="49" cy="52" rx="10" ry="7" fill="rgba(255,255,255,0.35)" />

      {/* brazos */}
      <path d="M28 66 q -9 -2 -12 -10" fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <path d={wave ? "M92 60 q 10 -6 9 -18" : "M92 66 q 9 -2 12 -10"} fill="none" stroke="#7c5cff" strokeWidth="5" strokeLinecap="round" />

      {/* ojos (parpadean con .mascot-eyes) */}
      <g className="mascot-eyes">
        <ellipse cx="50" cy="62" rx="7.5" ry="9" fill="#06121a" />
        <ellipse cx="70" cy="62" rx="7.5" ry="9" fill="#06121a" />
        <circle cx="52.4" cy="59" r="2.6" fill="#eafcff" />
        <circle cx="72.4" cy="59" r="2.6" fill="#eafcff" />
      </g>

      {/* mejillas */}
      <circle cx="40" cy="72" r="5" fill="rgba(255,120,180,0.45)" />
      <circle cx="80" cy="72" r="5" fill="rgba(255,120,180,0.45)" />

      {/* sonrisa */}
      <path d="M52 76 q 8 8 16 0" fill="none" stroke="#06121a" strokeWidth="3" strokeLinecap="round" />

      {/* moneda € en la mano izquierda */}
      <circle cx="18" cy="54" r="8" fill="#fdd663" stroke="#c99a1e" strokeWidth="1.5" />
      <text x="18" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7a5b06" fontFamily="Arial, sans-serif">€</text>
    </svg>
  );
}
