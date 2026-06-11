# Despliegue gratuito · Cuentas Claras

Objetivo: **coste 0 €**. El sitio es un *export estático* (`web/out`), así que se
puede alojar gratis en varias plataformas. Aquí está la recomendación y los pasos.

> La "actualización automática" no es en tiempo real (los presupuestos públicos se
> publican por periodos). Se implementa como **reconstrucción periódica**: un cron
> de GitHub Actions reejecuta el ETL (descarga los datos más recientes) y redespliega.
> Ver [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

---

## 1. Hosting gratuito — comparativa

| Plataforma | Coste | Ancho de banda | Pros | Contras |
|---|---|---|---|---|
| **Cloudflare Pages** ⭐ | Gratis | **Ilimitado** | Mejor para tráfico alto, CDN global, dominio propio gratis | Requiere cuenta Cloudflare |
| **GitHub Pages** | Gratis | 100 GB/mes (blando) | Cero cuentas externas, ya incluido en el repo | Solo estático; uso comercial fuera de ToS |
| **Vercel (Hobby)** | Gratis | 100 GB/mes | Hecho por los creadores de Next.js | Hobby = solo no comercial |
| **Netlify** | Gratis | 100 GB/mes | Muy buena DX | Límite de minutos de build |

**Recomendación:** empezar con **GitHub Pages** (incluido, sin cuentas extra; el
workflow ya está listo) y, si el tráfico crece, migrar a **Cloudflare Pages** por
su ancho de banda ilimitado.

### GitHub Pages — pasos
1. Sube el repo a GitHub (rama `main`).
2. Settings → Pages → Source: **GitHub Actions**.
3. El workflow [deploy.yml](.github/workflows/deploy.yml) construye y publica solo.
4. Si es una *project page* (`usuario.github.io/repo`), define la variable de repo
   `NEXT_PUBLIC_BASE_PATH = /repo`. Con dominio propio o *user page*, déjala vacía.

### Cloudflare Pages — pasos (alternativa)
1. Cuenta gratis en Cloudflare → Pages → Connect to Git.
2. Build command: `npm run etl && npm run build` · Output dir: `out` · Root: `web`.
3. Dominio `*.pages.dev` gratis al instante.

---

## 2. Dominio gratuito

| Opción | Ejemplo | Coste | Notas |
|---|---|---|---|
| Subdominio de la plataforma | `cuentas-claras.pages.dev` | Gratis | Inmediato, sin trámite |
| **eu.org** | `cuentasclaras.eu.org` | Gratis | Dominio real; aprobación ~14 días |
| **js.org** | `cuentasclaras.js.org` | Gratis | Para proyectos JS (este lo es); PR a su repo |
| **is-a.dev** | `cuentasclaras.is-a.dev` | Gratis | En la Public Suffix List; PR a su repo |

**Recomendación:** lanzar con el subdominio gratuito de Cloudflare/GitHub y, en
paralelo, solicitar **eu.org** (dominio más "serio" y europeo) o **js.org**.
Un `.es` real cuesta ~10 €/año si en el futuro se quiere algo totalmente propio.

---

## 3. Comando local

```bash
cd web
npm run etl     # refresca datos reales (Barcelona…)
npm run build   # genera web/out
npm run serve   # previsualiza el export estático
```

_Made in Italy_ 🇮🇹
