# Cómo publicar una entrada en el blog de Gitania

> **Importante:** cada entrada se publica en **español, inglés y francés**. La estructura y las reglas de traducción están en [`BLOG.md`](BLOG.md). Síguelo siempre, también en la rutina diaria del blog.

El blog es HTML estático en GitHub Pages (repo `gitania-site`, rama `main`). Cada entrada es un archivo dentro de `blog/`.

## Pasos

1. **Copia la plantilla.** Duplica `blog/_plantilla.html` como `blog/<slug>.html`.
   El slug va en minúsculas, sin acentos ni ñ, con guiones. Ejemplo: `blog/el-tarot-de-marsella.html`.
2. **Llena los campos `{{ }}`** de la plantilla (tres bloques: ES, EN y FR; ver `BLOG.md`):
   - `<title>`, meta description (unos 150 caracteres), canonical, `og:*`, `twitter:*`.
   - JSON-LD (`BlogPosting`): titular, descripción, fecha, imagen y las URLs de las fuentes en `citation`.
   - Título (H1, solo uno), bajada, fecha, cuerpo, fuentes y la nota final.
   - Imagen para redes: 1200 × 630 px en `assets/og/` (JPG de menos de 300 KB). Se puede reutilizar `assets/og/og-gitania.jpg`.
3. **Agrégala al índice** `blog.html`, entre `<!-- POSTS:START -->` y `<!-- POSTS:END -->`, **arriba de todo** (lo más nuevo primero). Copia un `<li class="post-card">` existente y cambia el enlace y las claves `data-i18n`; agrega el texto en `es`, `en` y `fr` en `STRINGS` (ver `BLOG.md`). Si es la primera entrada, borra el `<li class="post-empty">`.
4. **Agrégala a `sitemap.xml`** con un bloque `<url>` nuevo (`loc` con la URL completa y `lastmod` con la fecha `AAAA-MM-DD`).
5. **Revísala en local:** `python3 -m http.server 8000` en la carpeta del repo y abre `http://localhost:8000/blog/<slug>.html`. Comprueba que todos los enlaces funcionan.
6. **Sube los cambios** con la cuenta de Gitania (`gitaniatarot-creator`), nunca con cuentas de clientes.

## Archivos que se tocan en cada entrada

| Archivo | Qué cambia |
| --- | --- |
| `blog/<slug>.html` | La entrada nueva |
| `blog.html` | Una tarjeta nueva en la lista |
| `sitemap.xml` | Una URL nueva |
| `assets/og/<imagen>.jpg` | Opcional: imagen para compartir |

## Reglas de contenido

- Usa solo las fuentes del calendario editorial (`calendario-30-posts.md`) y cítalas al final con enlace. No inventes datos, citas ni fuentes. Si una fuente tiene ⚠️, sigue la nota.
- Presenta las creencias (magia, esoterismo, orígenes "egipcios" o "extraterrestres") como creencias, con respeto.
- La voz conoce el tema a fondo, pero nunca dice "soy experta".
- Los servicios de Gitania se describen como **lectura simbólica para la reflexión, la introspección y el autoconocimiento**, o como **acompañamiento**. Nunca como "terapia", "psicoterapia", "predicción" o "adivinación", y sin promesas de sanar. Sobre hipnosis, se dice "formación en hipnosis ericksoniana".
- Cada entrada termina con el bloque de Lecturas Express o Sesiones VIP y el aviso: *no sustituye la atención psicológica ni médica* (ya viene en la plantilla).

## Notas técnicas

- Los estilos de las entradas están en `assets/blog.css`.
- Los archivos que empiezan con `_` (como la plantilla) no se publican en GitHub Pages.
- `blog/index.html` solo redirige a `blog.html`, para que `gitania.gold/blog/` no dé error.

## Acceso VIP (vip.html)

- **v1 (Elois):** acceso en el navegador; `VIP_HASHES` guarda el SHA-256 de `usuario:contraseña`.
- **v2 (Ana y clientas nuevas):** el acceso y los archivos viven en el servidor (Netlify, proyecto `gitania-pagos`, función `/api/vip/*`). El repo público no guarda hashes, páginas privadas ni audios, videos o imágenes de clientas (`.gitignore` los bloquea). La contraseña se comprueba en el servidor (PBKDF2-SHA256).
- Herramienta: `node tools/vip.mjs` en `gitania-pagos` (`usuario`, `pagina`, `media`, `pass`, `token`, `lista`, `borrar`). La contraseña de admin se lee de un archivo local y nunca se imprime.
- `tools/set-vip-pass.py` ya no se usa para v2.

### Reglas

- Cada HTML de clienta lleva `<meta name="robots" content="noindex,nofollow">`.
- No agregues carpetas de clientas a `sitemap.xml` ni a `robots.txt`.
- Nunca subas al repo medios de clientas ni contraseñas.
