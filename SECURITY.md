# Política de seguridad · Cuentas Claras

## Reportar una vulnerabilidad

Si encuentras un problema de seguridad, **no abras un issue público**. Usa el
canal privado de GitHub:

➡️ [Reportar un advisory de seguridad](https://github.com/blackstardigitalstudio/cuentas-claras/security/advisories/new)

Intentaremos responder en un plazo razonable. Idiomas: español, italiano, inglés.

## Alcance

Cuentas Claras es un sitio **estático** (sin backend, sin base de datos, sin
datos de usuarios). La superficie de ataque es mínima. Aun así, nos interesan:

- Inyección de contenido / XSS en la interfaz.
- Problemas en la cadena de dependencias (npm).
- Configuración insegura de despliegue o cabeceras.

## Medidas activas

- Dependabot (alertas + actualizaciones de seguridad) y secret scanning con
  push protection en el repositorio.
- Análisis estático **CodeQL** en cada push y semanalmente.
- Cabeceras de seguridad (CSP, HSTS, X-Frame-Options…) en el despliegue — ver
  [`web/public/_headers`](web/public/_headers).
- Sin secretos en el repositorio; las credenciales de despliegue viven solo en
  los *secrets* de GitHub Actions.

_Made in Italy_ 🇮🇹
