# Cuentas Claras — mini-vídeos (Remotion)

Genera mini-vídeos verticales (1080×1920, ~16 s) para TikTok / Reels / YouTube
Shorts a partir de los **datos reales** del sitio. Cada vídeo termina con la URL
de la página correspondiente → lleva a la audiencia de vídeo hacia la web.

Los números salen del mismo dataset que el sitio (`../web/src/data/futbol.ts`),
así que **siempre son las cifras oficiales**, sin duplicar datos ni inventar nada.

## Uso

```bash
npm install

# Previsualizar en el navegador (Remotion Studio)
npm run studio

# Un solo club (por defecto Juventus)
npx remotion render ClubVideo out/juventus.mp4 --props='{"slug":"real-madrid"}'

# Todos los clubes con datos ricos (20 Serie A + Real Madrid + Barça)
node render-all.mjs
# …o solo algunos:
node render-all.mjs juventus inter real-madrid
```

Los MP4 se guardan en `video/out/` (ignorado por git). Luego se suben a mano a
las redes, con la URL del club en la descripción/bio.

## Formato

- Audio: sin voz, texto animado (subtítulos) — formato gratis, sin APIs de pago.
  Se puede añadir una pista de música royalty-free como `staticFile` más adelante.
- Marca neón coherente con las tarjetas sociales (`og-futbol.png`).
- Solo cifras oficiales · sin valores de mercado.

## Próximos formatos (mismos datos, nuevas composiciones)

- Sueldo del alcalde de una ciudad.
- Top 5 (más endeudadas / que más gastan).
- Récords del dinero público.

Made in Italy 🇮🇹
