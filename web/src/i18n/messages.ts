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
  impact: { lead: string; analyzed: string; cities: string; provinces: string; levels: string; weekly: string };
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
  footer: { data: string; tagline: string; disclaimer: string };
  news: { title: string; subtitle: string; readMore: string };
  nav: { map: string; news: string; scoop: string };
  scoop: {
    eyebrow: string;
    title: string;
    subtitle: string;
    badge: string;
    seeAll: string;
    empty: string;
    disclaimer: string;
  };
};

const es: Messages = {
  langName: "Español",
  banner: {
    real: "Datos reales en 50 ciudades de España + Italia",
    sample: "otras provincias: cifras de ejemplo",
  },
  hero: {
    eyebrow: "Transparencia · Datos públicos · España e Italia",
    titleA: "¿A dónde va ",
    highlight: "el dinero público",
    titleB: "?",
    subtitle:
      "Los ingresos y gastos reales de los ayuntamientos de España e Italia, en lenguaje claro. Mapa interactivo y desglose detallado del gasto, con datos oficiales.",
    cta1: "Explorar el mapa",
    cta2: "Fuente oficial",
  },
  stats: {
    provinces: "Provincias en el mapa",
    income: "Barcelona · ingresos 2024",
    expense: "Barcelona · gastos 2024",
    realLabel: "Datos reales",
  },
  impact: {
    lead: "Hemos puesto bajo la lupa",
    analyzed: "de gasto público real",
    cities: "ciudades con datos reales",
    provinces: "provincias mapeadas",
    levels: "niveles de desglose",
    weekly: "actualización semanal",
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
    disclaimer:
      "Aviso legal: Cuentas Claras reúne y simplifica datos presupuestarios públicos con fines informativos. A pesar de nuestro empeño en la exactitud, la información puede contener errores, omisiones o desfases respecto a la fuente, y no constituye información oficial ni asesoramiento de ningún tipo. Verifica siempre los datos en la fuente oficial antes de tomar decisiones. No asumimos ninguna responsabilidad por el uso que se haga de esta información.",
  },
  news: {
    title: "El dinero público en las noticias",
    subtitle: "Titulares recientes de medios sobre presupuestos y gasto público. Cada noticia enlaza al medio original.",
    readMore: "Leer en la fuente",
  },
  nav: { map: "Mapa", news: "Noticias", scoop: "Escándalos" },
  scoop: {
    eyebrow: "El lado duro del dinero público",
    title: "Escándalos del dinero público",
    subtitle:
      "Corrupción, fraude y mala gestión de fondos públicos en España e Italia, según los medios. Casos recientes, cada uno enlazado a su fuente.",
    badge: "Caso",
    seeAll: "Ver todos los escándalos",
    empty: "No hay titulares ahora mismo. Vuelve pronto.",
    disclaimer:
      "Importante: estos son titulares publicados por medios de comunicación, recopilados de forma automática y enlazados a su fuente original. Cuentas Claras no acusa a ninguna persona ni entidad y respeta plenamente la presunción de inocencia: mientras no exista sentencia firme, toda persona es inocente. Verifica siempre la información en la fuente.",
  },
};

const it: Messages = {
  langName: "Italiano",
  banner: {
    real: "Dati reali in 50 città di Spagna + Italia",
    sample: "altre province: dati di esempio",
  },
  hero: {
    eyebrow: "Trasparenza · Dati pubblici · Spagna e Italia",
    titleA: "Dove va ",
    highlight: "il denaro pubblico",
    titleB: "?",
    subtitle:
      "Le entrate e le spese reali dei comuni di Spagna e Italia, in linguaggio chiaro. Mappa interattiva e dettaglio approfondito della spesa, con dati ufficiali.",
    cta1: "Esplora la mappa",
    cta2: "Fonte ufficiale",
  },
  stats: {
    provinces: "Province sulla mappa",
    income: "Barcellona · entrate 2024",
    expense: "Barcellona · spese 2024",
    realLabel: "Dati reali",
  },
  impact: {
    lead: "Abbiamo messo sotto la lente",
    analyzed: "di spesa pubblica reale",
    cities: "città con dati reali",
    provinces: "province mappate",
    levels: "livelli di dettaglio",
    weekly: "aggiornamento settimanale",
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
    disclaimer:
      "Avviso legale: Cuentas Claras raccoglie e semplifica dati di bilancio pubblici a scopo informativo. Nonostante l'impegno per l'accuratezza, le informazioni possono contenere errori, omissioni o disallineamenti rispetto alla fonte, e non costituiscono informazione ufficiale né consulenza di alcun tipo. Verifica sempre i dati alla fonte ufficiale prima di prendere decisioni. Non ci assumiamo alcuna responsabilità per l'uso che viene fatto di queste informazioni.",
  },
  news: {
    title: "Il denaro pubblico nelle notizie",
    subtitle: "Titoli recenti dai media su bilanci e spesa pubblica. Ogni notizia rimanda alla testata originale.",
    readMore: "Leggi sulla fonte",
  },
  nav: { map: "Mappa", news: "Notizie", scoop: "Scandali" },
  scoop: {
    eyebrow: "Il lato duro del denaro pubblico",
    title: "Scandali del denaro pubblico",
    subtitle:
      "Corruzione, frode e cattiva gestione dei fondi pubblici in Spagna e Italia, secondo i media. Casi recenti, ciascuno collegato alla sua fonte.",
    badge: "Caso",
    seeAll: "Vedi tutti gli scandali",
    empty: "Nessun titolo al momento. Torna presto.",
    disclaimer:
      "Importante: questi sono titoli pubblicati dai media, raccolti automaticamente e collegati alla fonte originale. Cuentas Claras non accusa nessuna persona o ente e rispetta pienamente la presunzione di innocenza: fino a sentenza definitiva, ogni persona è innocente. Verifica sempre l'informazione alla fonte.",
  },
};

export const MESSAGES: Record<Locale, Messages> = { es, it };
