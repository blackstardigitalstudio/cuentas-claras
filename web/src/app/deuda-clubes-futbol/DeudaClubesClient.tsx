"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";
import { CLUB_DEBT } from "@/data/futbol";
import { formatEuro } from "@/lib/format";

// Ordine: prima chi deve di piu'. Il Napoli sta in fondo perche' non ha debito
// ma cassa: e' l'eccezione e va spiegata, non nascosta.
const ORDINATI = [...CLUB_DEBT].sort((a, b) => (a.kind === "caja" ? 1 : b.kind === "caja" ? -1 : b.amount - a.amount));
const RM = CLUB_DEBT.find((c) => c.club === "Real Madrid")!;
const BARSA = CLUB_DEBT.find((c) => c.club === "FC Barcelona")!;

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const max = Math.max(...CLUB_DEBT.map((c) => c.amount));

  const etichetta = (k: string) =>
    k === "bruta" ? t("deuda bruta", "debito lordo")
      : k === "neta" ? t("deuda neta", "debito netto")
        : t("caja neta positiva", "cassa netta positiva");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />

      <header className="pt-8">
        <p className="text-xs uppercase tracking-widest text-cyan/70">
          ⚽ {t("Deuda de los clubes · cuentas oficiales", "Debito dei club · bilanci ufficiali")}
        </p>
        <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-tight">
          {t("¿Cuánta deuda tiene de verdad ", "Quanti debiti ha davvero ")}
          <span className="neon-text">{t("tu club?", "il tuo club?")}</span>
        </h1>

        {/* La risposta secca, subito: e' quella che cercano e quella che i
            motori con l'AI citano. */}
        <div className="glass p-5 mt-5 border border-cyan/30">
          <p className="text-base md:text-lg">
            {t("El ", "Il ")}<b className="text-fg">Real Madrid</b>
            {t(" cerró con ", " ha chiuso con ")}
            <b className="text-cyan text-xl">{formatEuro(RM.amount)}</b>
            {t(" de deuda neta", " di debito netto")} ({RM.year}).{" "}
            {t("El ", "Il ")}<b className="text-fg">FC Barcelona</b>
            {t(" declara ", " dichiara ")}
            <b className="text-[#f43f5e]">{formatEuro(BARSA.amount)}</b>
            {t(" de deuda bruta", " di debito lordo")}.
          </p>
          <p className="text-sm text-muted mt-2">
            {t(
              "Sí, has leído bien: 12 millones, no 1.200. Pero ojo — no son la misma medida, y ahí está el truco. Te lo explicamos abajo.",
              "Sì, hai letto bene: 12 milioni, non 1.200. Ma attenzione — non sono la stessa misura, ed è lì che sta il trucco. Te lo spieghiamo sotto.",
            )}
          </p>
          <ShareFact
            className="mt-3"
            lang={it ? "it" : "es"}
            text={t(
              `⚽ ¿Cuánta deuda tiene el Real Madrid? ${formatEuro(RM.amount)} de deuda NETA a ${RM.year}. No son miles de millones: son 12 millones. Cifra de su propio Informe Económico. 👀`,
              `⚽ Quanti debiti ha il Real Madrid? ${formatEuro(RM.amount)} di debito NETTO al ${RM.year}. Non miliardi: dodici milioni. Cifra dal loro stesso bilancio. 👀`,
            )}
          />
        </div>
      </header>

      {/* IL TRUCCO: e' la parte che rende la pagina onesta e condivisibile. */}
      <div className="mt-6">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>
            {t(
              "Cuando un titular dice «el club X debe 1.000 millones» casi nunca te dice CUÁL de las dos deudas está contando. Y cambian muchísimo.",
              "Quando un titolo dice «il club X ha un miliardo di debiti» quasi mai ti dice QUALE dei due debiti sta contando. E cambiano parecchio.",
            )}
          </p>
          <p>
            <b className="text-fg/90">{t("Deuda bruta", "Debito lordo")}</b>
            {t(
              ": todo lo que el club debe, sin descontar nada. Es el número grande, el que sale en los titulares.",
              ": tutto quello che il club deve, senza togliere niente. È il numero grosso, quello che finisce nei titoli.",
            )}
          </p>
          <p>
            <b className="text-fg/90">{t("Deuda neta", "Debito netto")}</b>
            {t(
              ": lo que debe menos el dinero que tiene en el banco. Es como si de tu hipoteca restaras lo que tienes ahorrado.",
              ": quello che deve meno i soldi che ha in banca. È come se dal tuo mutuo togliessi quello che hai da parte.",
            )}
          </p>
          <p>
            {t(
              "Por eso comparar los 12 millones del Madrid con los 1.451 del Barça no es justo: son dos medidas distintas. En la tabla te decimos cuál es cuál, club por club.",
              "Per questo confrontare i 12 milioni del Madrid con i 1.451 del Barça non è corretto: sono due misure diverse. Nella tabella ti diciamo qual è quale, club per club.",
            )}
          </p>
        </SimpleExplainer>
      </div>

      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">
          {t("📊 Club por club, con la cuenta oficial", "📊 Club per club, con il bilancio ufficiale")}
        </h2>
        <p className="text-[11px] text-cyan/70 mb-4">
          {t(
            "Cifras de las cuentas anuales publicadas por cada club. Pincha en la fuente para verlas tú mismo.",
            "Cifre prese dai bilanci pubblicati da ogni club. Clicca sulla fonte e le vedi tu stesso.",
          )}
        </p>
        <ul className="space-y-2">
          {ORDINATI.map((c) => {
            const cassa = c.kind === "caja";
            const col = cassa ? "#34d399" : c.kind === "bruta" ? "#f43f5e" : "#fbbf24";
            return (
              <li key={c.club} className="glass px-3 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">
                    {c.club}
                    <span className="text-[11px] text-muted font-normal"> · {etichetta(c.kind)} · {c.year}</span>
                  </span>
                  <span className="tabular font-semibold shrink-0" style={{ color: col }}>
                    {cassa ? "+" : ""}{formatEuro(c.amount)}
                  </span>
                </div>
                <span className="mt-1.5 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${Math.max(3, (c.amount / max) * 100)}%`, background: col }} />
                </span>
                <p className="text-[10px] text-muted mt-1.5">
                  <a href={c.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{c.source.name}</a>
                </p>
              </li>
            );
          })}
        </ul>
        <div className="glass p-4 mt-3 border border-green/25">
          <p className="text-sm">
            {t(
              "El Nápoles es el caso raro: no tiene deuda, tiene dinero. Su posición financiera neta es POSITIVA en ",
              "Il Napoli è il caso raro: non ha debiti, ha soldi. La sua posizione finanziaria netta è POSITIVA per ",
            )}
            <b className="text-green">{formatEuro(137000000)}</b>.
          </p>
        </div>
      </section>

      <ShareBar
        className="mt-8"
        lang={it ? "it" : "es"}
        text={t(
          "⚽ ¿Cuánta deuda tiene tu club de verdad? El Real Madrid 12 mln € netos, el Barça 1.451 mln brutos, el Nápoles ni debe: tiene caja. Cifras de las cuentas oficiales. 👀",
          "⚽ Quanti debiti ha davvero il tuo club? Il Real Madrid 12 mln € netti, il Barça 1.451 mln lordi, il Napoli non deve niente: ha cassa. Cifre dai bilanci ufficiali. 👀",
        )}
      />

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanti debiti ha il Real Madrid?", a: `${formatEuro(RM.amount)} di debito finanziario netto al ${RM.year}, secondo il bilancio pubblicato dal club stesso. Non sono miliardi: il Madrid ha molta liquidità, che si sottrae dal debito lordo.` },
                { q: "Quanti debiti ha il Barcellona?", a: `${formatEuro(BARSA.amount)} di debito lordo (${BARSA.year}), dalle sue cuentas anuales. È una misura diversa da quella del Madrid: il lordo non toglie i soldi in cassa.` },
                { q: "Qual è la differenza fra debito lordo e debito netto?", a: "Il lordo è tutto quello che il club deve. Il netto è quello che deve meno i soldi che ha in banca. Un club può avere un lordo enorme e un netto piccolo, se ha molta liquidità: per questo confrontare due club usando misure diverse non ha senso." },
                { q: "Quale club di Serie A ha più debiti?", a: `Tra quelli che pubblicano il dato, la Juventus con ${formatEuro(302800000)} di indebitamento finanziario netto (2024/25), davanti a Inter (${formatEuro(248400000)}) e Roma (${formatEuro(153400000)}).` },
                { q: "C'è un club senza debiti?", a: `Il Napoli: non ha debito netto ma una posizione finanziaria netta positiva di ${formatEuro(137000000)}. In pratica ha più soldi in cassa di quanti ne debba.` },
              ]
            : [
                { q: "¿Cuánta deuda tiene el Real Madrid?", a: `${formatEuro(RM.amount)} de deuda financiera neta a ${RM.year}, según el informe económico publicado por el propio club. No son miles de millones: el Madrid tiene mucha caja, y esa caja se resta de la deuda bruta.` },
                { q: "¿Cuánta deuda tiene el Barça?", a: `${formatEuro(BARSA.amount)} de deuda bruta (${BARSA.year}), según sus cuentas anuales. Es una medida distinta a la del Madrid: la bruta no descuenta el dinero en caja.` },
                { q: "¿Qué diferencia hay entre deuda bruta y deuda neta?", a: "La bruta es todo lo que el club debe. La neta es lo que debe menos el dinero que tiene en el banco. Un club puede tener una bruta enorme y una neta pequeña si tiene mucha caja: por eso comparar dos clubes con medidas distintas no dice nada." },
                { q: "¿Qué club italiano debe más?", a: `De los que publican el dato, la Juventus con ${formatEuro(302800000)} de deuda financiera neta (2024/25), por delante del Inter (${formatEuro(248400000)}) y la Roma (${formatEuro(153400000)}).` },
                { q: "¿Hay algún club sin deuda?", a: `El Nápoles: no tiene deuda neta sino una posición financiera neta positiva de ${formatEuro(137000000)}. Es decir, tiene más dinero en caja del que debe.` },
              ]
          ).map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-8 glass p-4 border border-amber-400/25">
        <p className="text-xs text-amber-200/90">
          {t(
            "⚠️ Solo cifras que los clubes publican en sus cuentas. Los clubes que no publican deuda no salen aquí: preferimos dejar el hueco antes que rellenarlo con estimaciones de prensa.",
            "⚠️ Solo cifre che i club pubblicano nei loro bilanci. I club che non pubblicano il debito qui non ci sono: meglio lasciare il buco che riempirlo con stime di giornale.",
          )}
        </p>
      </div>

      <nav className="mt-8 flex flex-wrap gap-3">
        <Link href={it ? "/calcio/" : "/futbol/"} className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("Las cuentas de cada club →", "I conti di ogni club →")}
        </Link>
        <Link href={it ? "/calcio-mondiale/" : "/futbol-mundial/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Qué liga ingresa más", "Quale campionato incassa di più")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · {t("Hecho en Italia", "Made in Italy")} 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function DeudaClubesClient({ locale }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
