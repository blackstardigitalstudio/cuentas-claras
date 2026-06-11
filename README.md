# Cuentas Claras 🇪🇸

> Visualización futurista, en lenguaje claro, de **a dónde van los fondos públicos** de los ayuntamientos españoles: ingresos y gastos, por municipio y por categoría, con datos oficiales del Ministerio de Hacienda.

**Made in Italy** 🇮🇹

---

## Qué es

Un sitio web público y gratuito que convierte los datos presupuestarios oficiales —hoy dispersos en portales técnicos y formatos crudos— en una experiencia visual clara para cualquier ciudadano:

- 🗺️ **Mapa interactivo de toda España** (incluidas Canarias) — clic en cualquier municipio.
- 💶 **Ingresos vs. Gastos** con diagrama Sankey "sigue el euro".
- 🔎 **Filtros** por municipio → categoría → año.
- 📊 Gráficos y tablas cuidadas, diseño futurista con motion graphics.

### Posicionamiento honesto sobre los datos

Los presupuestos públicos **no existen en tiempo real**: se publican de forma periódica (liquidaciones anuales, con meses de retraso). Por eso la promesa del sitio es **"datos oficiales siempre actualizados a la última publicación disponible"**, mostrando siempre la **fecha de la fuente** y un **enlace al dato oficial**. La actualización automática se hace vía regeneración incremental (ISR) cuando la fuente publica nuevos datos.

---

## Arquitectura

Monorepo:

```
/web    → Aplicación Next.js 16 (App Router, TypeScript, Tailwind v4)
          Renderizado SSG/ISR para SEO (una página estática por municipio).
/data   → Pipeline ETL: descarga, normaliza y traduce los datos del
          Ministerio de Hacienda a un modelo de datos único.
```

### Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 16** (SSG/ISR) | SEO: páginas estáticas pre-renderizadas por municipio |
| Estilos | **Tailwind CSS v4** | Velocidad + design system consistente |
| Mapa | **MapLibre GL** | Open-source, sin costes de licencia (vs Mapbox) |
| Motion | **Motion** (framer-motion) | Animaciones, lazy-loaded para no romper Core Web Vitals |
| Dataviz | **D3 / d3-sankey** | Sankey ingresos→gastos, control total del render |

---

## Fuentes de datos (oficiales)

| Fuente | Uso |
|---|---|
| [Ministerio de Hacienda — Presupuestos y liquidaciones de EE.LL. (datos individuales)](https://datos.gob.es/es/catalogo/e05188501-presupuestos-y-liquidaciones-de-las-entidades-locales-datos-individuales) | Ingresos y gastos de **todos** los municipios |
| [CONPREL](https://serviciostelematicosext.hacienda.gob.es/SGFAL/CONPREL) | Consulta presupuestos y liquidaciones EE.LL. |
| [INE](https://www.ine.es/) | Códigos oficiales de municipios y población |
| [IGN/CNIG](https://centrodedescargas.cnig.es/) · [georef-spain-municipio](https://public.opendatasoft.com/explore/assets/georef-spain-municipio/) | Límites GeoJSON de municipios (incl. Canarias) |

---

## Estado del proyecto

- [x] Fase 0 — Scaffolding (Next.js + Tailwind + librerías)
- [ ] Fase 1 — Pipeline ETL de datos reales (Ministerio de Hacienda)
- [ ] Fase 2 — Mapa de España + diseño futurista + gráficos
- [ ] Fase 3 — SEO programática + despliegue

---

## Desarrollo

```bash
cd web
npm run dev      # servidor de desarrollo
npm run build    # build de producción
```

---

_Hecho con datos públicos, para la ciudadanía._ · **Made in Italy** 🇮🇹
