// Dati strutturati "Article" con la CITAZIONE della fonte.
//
// PERCHÉ SERVE: i motori con l'AI (le AI Overviews di Google, ChatGPT,
// Perplexity) citano volentieri le pagine che dichiarano in modo leggibile da
// una macchina DA DOVE viene il numero. Noi la fonte ce l'abbiamo sempre, ma
// finora stava solo nel testo: nessuna pagina la dichiarava nello schema.
// È la differenza tra essere letti e essere citati.
//
// Regola: `source` deve puntare alla fonte VERA di quella pagina, quella che la
// pagina mostra già al lettore. Mai una fonte generica messa lì per riempire.

export type Fonte = { name: string; url: string };

export function articleLd(opts: {
  headline: string;
  lang: "es" | "it";
  url: string;
  source: Fonte | Fonte[];
  about: string;
  description?: string;
}) {
  const fonti = Array.isArray(opts.source) ? opts.source : [opts.source];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    ...(opts.description ? { description: opts.description } : {}),
    inLanguage: opts.lang,
    url: opts.url,
    isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: opts.url.split("/").slice(0, 3).join("/") },
    publisher: { "@type": "Organization", name: "Cuentas Claras" },
    about: { "@type": "Thing", name: opts.about },
    citation: fonti.map((f) => ({ "@type": "CreativeWork", name: f.name, url: f.url })),
    isAccessibleForFree: true,
  };
}

// Le fonti ufficiali ricorrenti, in un posto solo: se un URL cambia si corregge
// qui e non in venti pagine.
export const FONTI = {
  haciendaDeuda: { name: "Ministerio de Hacienda · Deuda viva de las Entidades Locales", url: "https://www.hacienda.gob.es/es-ES/CDI/Paginas/SistemasFinanciacionDeuda/InformacionEELLs/DeudaViva(EELL).aspx" },
  ispa: { name: "MTDFP · ISPA, retribuciones de alcaldes", url: "https://digital.gob.es/portal-de-la-funcion-publica.html" },
  siope: { name: "SIOPE · Ragioneria Generale dello Stato (MEF)", url: "https://bdap-opendata.rgs.mef.gov.it" },
  alcaldes: { name: "Ministerio de Política Territorial · Cargos Representativos Locales", url: "https://concejales.redsara.es/consulta" },
  dmInterno: { name: "Ministero dell'Interno · DM 30/05/2022, indennità amministratori locali", url: "https://dait.interno.gov.it/documenti/decreto-fl-30-05-2022-all-a.pdf" },
  irpef: { name: "Agenzia delle Entrate · aliquote e calcolo dell'IRPEF", url: "https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef" },
  ley31: { name: "Ley 31/2022 de Presupuestos Generales del Estado (art. 18)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128" },
  lbrl: { name: "Ley 7/1985, Reguladora de las Bases del Régimen Local", url: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392" },
  tuel: { name: "D.Lgs. 267/2000 · Testo unico degli enti locali", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2000-08-18;267" },
  uefa: { name: "UEFA · distribución de ingresos", url: "https://www.uefa.com/" },
  fifa: { name: "FIFA · media releases", url: "https://inside.fifa.com/" },
  deloitte: { name: "Deloitte Football Money League", url: "https://www.deloitte.com/uk/en/services/consulting-financial/analysis/deloitte-football-money-league.html" },
  bde: { name: "Banco de España · deuda de las Administraciones Públicas", url: "https://www.bde.es/" },
  bankitalia: { name: "Banca d'Italia · debito delle Amministrazioni pubbliche", url: "https://www.bancaditalia.it/" },
  comisionUE: { name: "Comisión Europea · Recovery and Resilience Facility", url: "https://commission.europa.eu/strategy-and-policy/recovery-plan-europe_en" },
  sanidad: { name: "Ministerio de Sanidad · Estadística de Gasto Sanitario Público", url: "https://www.sanidad.gob.es/estadEstudios/estadisticas/inforRecopilaciones/gastoSanitario2005/home.htm" },
  istat: { name: "Istat · assistenza e previdenza", url: "https://www.istat.it/statistiche-per-tema/settori/assistenza-e-previdenza/" },
  segSocial: { name: "Seguridad Social · estadísticas y presupuestos", url: "https://www.seg-social.es/wps/portal/wss/internet/EstadisticasPresupuestosEstudios" },
  ocse: { name: "OCDE · Taxing Wages", url: "https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en.html" },
} satisfies Record<string, Fonte>;
