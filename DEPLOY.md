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

**Configurado:** el workflow [deploy.yml](.github/workflows/deploy.yml) ya despliega
en **Cloudflare Pages** (ancho de banda ilimitado) en cada push y una vez al mes.

### Cloudflare Pages vía GitHub Actions — pasos (el actual)
1. El repo ya está en GitHub (`blackstardigitalstudio/cuentas-claras`).
2. En **Cloudflare → Pages**, crea un proyecto llamado `cuentas-claras` (Direct Upload
   o déjalo que lo cree el primer deploy).
3. Crea un **API Token** (plantilla "Edit Cloudflare Pages") y copia el **Account ID**.
4. En GitHub → Settings → Secrets and variables → Actions, añade:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. Lanza el workflow (push o "Run workflow"). Tu **dominio** se conecta en
   Cloudflare Pages → Custom domains.

### Alternativa sin secrets: integración Git de Cloudflare
Cloudflare → Pages → Connect to Git → repo `cuentas-claras`.
Build command: `npm run etl && npm run build` · Output: `out` · Root directory: `web`.
(En este modo, el cron mensual de actualización se hace con un *Deploy Hook*.)

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
