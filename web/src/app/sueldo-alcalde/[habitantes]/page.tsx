import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/data";
import { TAGLIE_ES, tramoPorHabitantes, FUENTE_ES, nEu } from "@/data/fasce-sindaci";
import TramoClient, { type Municipio, type Real } from "./TramoClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Una página por cada tamaño de municipio que la gente escribe de verdad en
// Google ("cuánto cobra un alcalde de un pueblo de 500 habitantes"). La
// pregunta siempre va pegada al tamaño del PROPIO pueblo.
export function generateStaticParams() {
  return TAGLIE_ES.map((t) => ({ habitantes: `${t}-habitantes` }));
}

function parse(slug: string): number | null {
  const m = slug.match(/^(\d+)-habitantes$/);
  if (!m) return null;
  const n = Number(m[1]);
  return TAGLIE_ES.includes(n) ? n : null;
}

const eur = (n: number) => `${nEu(n)} €`;

function conSueldo() {
  return Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample && r.poblacion && r.mayorSalary);
}

// El dato propio: el tope es público, pero la MEDIANA real de lo que cobran los
// alcaldes de ese tamaño no la publica nadie. La calculamos sobre las
// retribuciones oficiales del ISPA que ya tenemos municipio a municipio.
function realDelTramo(hab: number): Real {
  const t = tramoPorHabitantes(hab);
  const xs = conSueldo()
    .filter((r) => r.poblacion! >= t.min && (t.max === null || r.poblacion! <= t.max))
    .map((r) => r.mayorSalary!.amount)
    .sort((a, b) => a - b);
  // Con pocos municipios una mediana no significa nada: decir "la mitad de los
  // alcaldes cobra X" con 7 datos sería vender ruido como dato. Por debajo de
  // 10 la página se queda solo con el tope legal, que sí es un hecho.
  if (xs.length < 10) return null;
  return {
    n: xs.length,
    mediana: Math.round(xs[Math.floor(xs.length / 2)]),
    media: Math.round(xs.reduce((a, b) => a + b, 0) / xs.length),
    aCero: xs.filter((x) => x === 0).length,
  };
}

function municipiosDelTramo(hab: number): { municipios: Municipio[]; exactos: boolean } {
  const t = tramoPorHabitantes(hab);
  const todos = conSueldo();
  const map = (rs: typeof todos): Municipio[] =>
    rs.slice(0, 8).map((r) => ({ name: r.name, slug: r.slug, poblacion: r.poblacion!, anual: r.mayorSalary!.amount }));

  const dentro = todos
    .filter((r) => r.poblacion! >= t.min && (t.max === null || r.poblacion! <= t.max))
    .sort((a, b) => Math.abs(a.poblacion! - hab) - Math.abs(b.poblacion! - hab));
  if (dentro.length) return { municipios: map(dentro), exactos: true };

  const masPequenos = [...todos].sort((a, b) => a.poblacion! - b.poblacion!);
  return { municipios: map(masPequenos), exactos: false };
}

type Props = { params: Promise<{ habitantes: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { habitantes } = await params;
  const hab = parse(habitantes);
  if (!hab) return {};
  const t = tramoPorHabitantes(hab);
  const real = realDelTramo(hab);
  const n = nEu(hab);

  // Número + pregunta abierta: el tope da credibilidad, pero lo que de verdad
  // cobran no lo puede resolver Google en el snippet.
  // La pregunta del título tiene que ser una que la página responda de verdad.
  // Si no tenemos la mediana real de ese tramo, prometer "¿Y real?" sería
  // vender algo que dentro no está.
  const title = t.tope === null
    ? `Alcalde de ${n} habitantes: ¿puede cobrar sueldo?`
    : real
      ? `Alcalde de ${n} habitantes: tope ${eur(t.tope)}. ¿Y real?`
      : `Alcalde de ${n} habitantes: hasta ${eur(t.tope)}. ¿Lo cobra?`;

  const description = t.tope === null
    ? `¿Cuánto cobra el alcalde de un pueblo de ${n} habitantes? Por debajo de 1.000 habitantes la ley no permite la dedicación exclusiva: como mucho parcial, o solo asistencias por pleno. Muchos alcaldes no cobran nada del ayuntamiento. Te explicamos quién lo decide y por qué.`
    : `¿Cuánto cobra el alcalde de un pueblo de ${n} habitantes? La ley permite hasta ${eur(t.tope)} al año en municipios ${t.label}` +
      (real ? `, pero la mitad de los alcaldes de ese tamaño cobra ${eur(real.mediana)} o menos: lo hemos calculado sobre ${real.n} municipios con la retribución oficial declarada.` : ". Te contamos quién decide la cifra real.");

  return {
    title,
    description,
    keywords: [
      `cuánto cobra un alcalde de un pueblo de ${n} habitantes`,
      `sueldo alcalde ${n} habitantes`,
      "sueldo alcaldes pueblos pequeños",
      "cuánto cobra un alcalde en España",
      "tope sueldo alcalde ley",
      "dedicación exclusiva alcalde",
      "cuanto cobra un concejal en un pueblo",
    ],
    alternates: { canonical: `${SITE}/sueldo-alcalde/${hab}-habitantes/` },
    openGraph: {
      title: t.tope === null ? `Alcalde de ${n} habitantes: ¿puede cobrar?` : `Alcalde de ${n} habitantes: ¿cuánto cobra de verdad?`,
      description: t.tope === null
        ? "Por debajo de 1.000 habitantes no cabe la dedicación exclusiva. Muchos no cobran nada."
        : `Tope legal ${eur(t.tope)} al año${real ? `, mediana real ${eur(real.mediana)}` : ""}.`,
      url: `${SITE}/sueldo-alcalde/${hab}-habitantes/`,
      type: "article",
      images: [{ url: "/og-sueldos.png", width: 1200, height: 630, alt: `Sueldo del alcalde de un municipio de ${n} habitantes` }],
    },
    twitter: { card: "summary_large_image", title: `Alcalde de ${n} habitantes: ¿cuánto cobra?`, description: t.tope ? `Tope legal ${eur(t.tope)} al año.` : "Sin dedicación exclusiva por ley.", images: ["/og-sueldos.png"] },
  };
}

export default async function SueldoAlcaldePage({ params }: Props) {
  const { habitantes } = await params;
  const hab = parse(habitantes);
  if (!hab) notFound();

  const t = tramoPorHabitantes(hab);
  const real = realDelTramo(hab);
  const { municipios, exactos } = municipiosDelTramo(hab);
  const n = nEu(hab);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        q: `¿Cuánto cobra el alcalde de un pueblo de ${n} habitantes?`,
        a: t.tope === null
          ? "En municipios de menos de 1.000 habitantes el alcalde no puede tener dedicación exclusiva. Como mucho dedicación parcial, o solo asistencias por cada pleno al que acude. Muchos no cobran nada del ayuntamiento."
          : `Como máximo ${eur(t.tope)} al año: es el tope que fija la Ley 31/2022 para municipios ${t.label}.` +
            (real ? ` En la práctica la mitad de los alcaldes de este tamaño cobra ${eur(real.mediana)} o menos, según las retribuciones oficiales de ${real.n} municipios.` : ""),
      },
      { q: "¿Ese tope es lo que cobran de verdad?", a: "No. La ley solo fija el máximo; por debajo decide cada ayuntamiento en un pleno. Por eso dos municipios del mismo tamaño pueden pagar cantidades muy distintas, y algunos alcaldes no cobran nada." },
      { q: "¿Todos los alcaldes cobran sueldo?", a: "No. El alcalde solo cobra si el pleno le aprueba una dedicación, exclusiva o parcial. Si no, únicamente percibe asistencias por acudir a los plenos. En España uno de cada tres alcaldes no cobra sueldo del ayuntamiento." },
      { q: "¿Quién decide el sueldo del alcalde?", a: "El pleno del ayuntamiento, dentro del tope máximo que fija la Ley de Presupuestos Generales del Estado según los habitantes del municipio." },
    ].map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Cuánto cobra el alcalde de un municipio de ${n} habitantes`,
    inLanguage: "es",
    isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: SITE },
    citation: { "@type": "CreativeWork", name: FUENTE_ES.name, url: FUENTE_ES.url },
    about: { "@type": "Thing", name: "Retribuciones de los alcaldes en España" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Sueldos de alcaldes", item: `${SITE}/sueldos-alcaldes/` },
      { "@type": "ListItem", position: 3, name: `Municipio de ${n} habitantes`, item: `${SITE}/sueldo-alcalde/${hab}-habitantes/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <TramoClient
        habitantes={hab}
        tramoLabel={t.label}
        tope={t.tope}
        nota={t.nota}
        real={real}
        municipios={municipios}
        municipiosExactos={exactos}
      />
    </>
  );
}
