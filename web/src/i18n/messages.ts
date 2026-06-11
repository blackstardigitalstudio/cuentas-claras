// Diccionario de la interfaz en español e italiano.
// (Las etiquetas de las CATEGORÍAS de datos se mantienen en el idioma de la
//  fuente — p. ej. español para municipios españoles — y se traducirán cuando
//  se añadan municipios italianos con sus propias etiquetas.)

export type Locale = "es" | "it";
export const LOCALES: Locale[] = ["es", "it"];
export const DEFAULT_LOCALE: Locale = "es";

export type Messages = {
  langName: string;
  banner: { real: string; sample: string };
  hero: {
    eyebrow: string;
    titleA: string;
    highlight: string;
    titleB: string;
    subtitle: string;
    cta1: string;
    cta2: string;
  };
  stats: { provinces: string; income: string; expense: string; realLabel: string };
  how: { t1: string; d1: string; t2: string; d2: string; t3: string; d3: string };
  explorer: { mapTitle: string; province: string; withReal: string; topSpending: string; spain: string; italy: string };
  panel: {
    municipality: string;
    province: string;
    sample: string;
    real: string;
    source: string;
    income: string;
    expense: string;
    balance: string;
    surplus: string;
    deficit: string;
    sankeyTitle: string;
    whereGoes: string;
    whereGoesHint: string;
    howSpent: string;
  };
  footer: { data: string; tagline: string };
  news: { title: string; subtitle: string; readMore: string };
};

const es: Messages = {
  langName: "Español",
  banner: {
    real: "Barcelona: datos reales 2024",
    sample: "resto de provincias: cifras de ejemplo (carga en curso)",
  },
  hero: {
    eyebrow: "Transparencia · Datos públicos · España",
    titleA: "¿A dónde va ",
    highlight: "el dinero público",
    titleB: "?",
    subtitle:
      "Explora de forma clara los ingresos y gastos de los ayuntamientos españoles. Mapa interactivo por provincia y categoría, con datos oficiales.",
    cta1: "Explorar el mapa",
    cta2: "Fuente oficial",
  },
  stats: {
    provinces: "Provincias en el mapa",
    income: "Barcelona · ingresos 2024",
    expense: "Barcelona · gastos 2024",
    realLabel: "Datos reales",
  },
  how: {
    t1: "Datos oficiales",
    d1: "Las cifras provienen de las liquidaciones presupuestarias que los ayuntamientos comunican al Ministerio de Hacienda.",
    t2: "Siempre actualizado",
    d2: "No es 'tiempo real' (los presupuestos se publican por periodos), pero el sitio se regenera al publicarse nuevos datos.",
    t3: "Lenguaje claro",
    d3: "Traducimos la clasificación técnica a categorías que cualquier ciudadano entiende: educación, social, servicios básicos…",
  },
  explorer: {
    mapTitle: "Mapa de España",
    province: "Provincia",
    withReal: "Con datos reales",
    topSpending: "Mayor gasto (ejemplo)",
    spain: "España",
    italy: "Italia",
  },
  panel: {
    municipality: "Ayuntamiento",
    province: "Provincia",
    sample: "Ejemplo",
    real: "Datos reales",
    source: "Fuente:",
    income: "Ingresos",
    expense: "Gastos",
    balance: "Saldo:",
    surplus: "(superávit)",
    deficit: "(déficit)",
    sankeyTitle: "Sigue el euro: del ingreso al gasto",
    whereGoes: "¿A dónde va el gasto?",
    whereGoesHint: "Toca una categoría para ver el detalle",
    howSpent: "¿En qué forma se gasta?",
  },
  footer: {
    data: "Datos:",
    tagline: "Hecho con datos públicos, para la ciudadanía",
  },
  news: {
    title: "El dinero público en las noticias",
    subtitle: "Titulares recientes de medios sobre presupuestos y gasto público. Cada noticia enlaza al medio original.",
    readMore: "Leer en la fuente",
  },
};

const it: Messages = {
  langName: "Italiano",
  banner: {
    real: "Barcellona: dati reali 2024",
    sample: "resto delle province: dati di esempio (caricamento in corso)",
  },
  hero: {
    eyebrow: "Trasparenza · Dati pubblici · Spagna",
    titleA: "Dove va ",
    highlight: "il denaro pubblico",
    titleB: "?",
    subtitle:
      "Esplora in modo chiaro le entrate e le spese dei comuni spagnoli. Mappa interattiva per provincia e categoria, con dati ufficiali.",
    cta1: "Esplora la mappa",
    cta2: "Fonte ufficiale",
  },
  stats: {
    provinces: "Province sulla mappa",
    income: "Barcellona · entrate 2024",
    expense: "Barcellona · spese 2024",
    realLabel: "Dati reali",
  },
  how: {
    t1: "Dati ufficiali",
    d1: "Le cifre provengono dai rendiconti di bilancio che i comuni comunicano al Ministero delle Finanze.",
    t2: "Sempre aggiornato",
    d2: "Non è 'tempo reale' (i bilanci si pubblicano per periodi), ma il sito si rigenera quando escono nuovi dati.",
    t3: "Linguaggio chiaro",
    d3: "Traduciamo la classificazione tecnica in categorie che chiunque capisce: istruzione, sociale, servizi di base…",
  },
  explorer: {
    mapTitle: "Mappa della Spagna",
    province: "Provincia",
    withReal: "Con dati reali",
    topSpending: "Spesa maggiore (esempio)",
    spain: "Spagna",
    italy: "Italia",
  },
  panel: {
    municipality: "Comune",
    province: "Provincia",
    sample: "Esempio",
    real: "Dati reali",
    source: "Fonte:",
    income: "Entrate",
    expense: "Spese",
    balance: "Saldo:",
    surplus: "(avanzo)",
    deficit: "(disavanzo)",
    sankeyTitle: "Segui l'euro: dall'entrata alla spesa",
    whereGoes: "Dove va la spesa?",
    whereGoesHint: "Tocca una categoria per vederne il dettaglio",
    howSpent: "In che forma si spende?",
  },
  footer: {
    data: "Dati:",
    tagline: "Fatto con dati pubblici, per i cittadini",
  },
  news: {
    title: "Il denaro pubblico nelle notizie",
    subtitle: "Titoli recenti dai media su bilanci e spesa pubblica. Ogni notizia rimanda alla testata originale.",
    readMore: "Leggi sulla fonte",
  },
};

export const MESSAGES: Record<Locale, Messages> = { es, it };
