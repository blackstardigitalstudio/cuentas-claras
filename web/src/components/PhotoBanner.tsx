// Banner fotografico decorativo (foto reale self-hosted, licencia libre Unsplash).
// Sin hooks → se puede usar en páginas server o client. Reduce el "muro de texto".

export default function PhotoBanner({
  src,
  alt = "",
  caption,
  className = "",
  ratio = "banner",
}: {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  ratio?: "banner" | "wide";
}) {
  const aspect = ratio === "wide" ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/9] md:aspect-[3/1]";
  return (
    <figure className={`relative w-full ${aspect} overflow-hidden rounded-2xl border border-[var(--panel-border)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/25 to-transparent" />
      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan via-violet to-cyan opacity-90" />
      {caption && <figcaption className="absolute bottom-2 right-3 text-[10px] text-muted/70">{caption}</figcaption>}
    </figure>
  );
}
