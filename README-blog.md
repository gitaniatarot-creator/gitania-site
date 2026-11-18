# Cómo publicar una entrada en el blog de Gitania

El blog es HTML estático en GitHub Pages (repo `gitania-site`, rama `main`). Cada entrada es un archivo dentro de `blog/`.

## Pasos

1. **Copia la plantilla.** Duplica `blog/_plantilla.html` como `blog/<slug>.html`.
   El slug va en minúsculas, sin acentos ni ñ, con guiones. Ejemplo: `blog/el-tarot-de-marsella.html`.
2. **Llena los campos `{{ }}`** de la plantilla:
   - `<title>`, meta description (unos 150 caracteres), canonical, `og:*`, `twitter:*`.
   - JSON-LD (`BlogPosting`): titular, descripción, fecha, imagen y las URLs de las fuentes en `citation`.
   - Título (H1, solo uno), bajada, fecha, cuerpo, fuentes y la nota final.
   - Imagen para redes: 1200 × 630 px en `assets/og/` (JPG de menos de 300 KB). Se puede reutilizar `assets/og/og-gitania.jpg`.
3. **Agrégala al índice** `blog.html`, entre `<!-- POSTS:START -->` y `<!-- POSTS:END -->`, **arriba de todo** (lo más nuevo primero). Copia un `<li class="post-card">` existente y cambia el enlace, la fecha, la sección, el título y el resumen. Si es la primera entrada, borra el `<li class="post-empty">`.
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

El sitio no guarda contraseñas legibles ni nombres de carpetas. Hay dos tipos de acceso:

- **v1 (Elois, sin cambios):** `VIP_HASHES` guarda el SHA-256 de `usuario:contraseña`. Carpeta: primeros 32 caracteres del SHA-256 de `gitania-path:usuario:contraseña`.
- **v2 (clientas nuevas, p. ej. Ana):** `VIP_HASHES_V2` guarda un PBKDF2-SHA256 (sal `gitania-vip:usuario`, 200 000 vueltas). Es miles de veces más lento de adivinar. Carpeta: primeros 32 caracteres del SHA-256 de `gitania-path-v2:<ese hash>`.

En ambos casos se entra a `clientes/<carpeta>/<usuario>-manual.html`.

### Poner o cambiar la contraseña de una clienta v2

```bash
python3 tools/set-vip-pass.py ana            # te pide la contraseña sin mostrarla
# o: tools/set-vip-pass.sh ana "frase-larga-de-4-palabras"
```

El script exige 12 caracteres o más, actualiza `vip.html` y la página de la clienta, y renombra su carpeta. Al cambiar la contraseña, el link viejo deja de servir. Después: `git status`, revisar y commit.

### Nueva clienta v2

1. Copia la carpeta de Ana a `clientes/<cualquier-nombre>/`, renombra `ana-manual.html` a `<usuario>-manual.html` y pon `accessHash: "PENDIENTE_HASH_<NOMBRE>"`.
2. Agrega ese mismo texto a `VIP_HASHES_V2` en `vip.html`.
3. Corre `tools/set-vip-pass.py <usuario>`.

### Membresía (página de Ana)

En el bloque `CONFIG` de `ana-manual.html`: `pagadoHasta` (fecha), `pagoMembresiaUrl`, `joyas[].url`, y los audios, videos y PDF. Pasada la fecha, la página muestra el aviso de renovación. Para ver el aviso sin esperar: agrega `?vista=vencida` al link.
Ojo: el candado por fecha corre en el navegador. Es una cortina, no una caja fuerte. Si alguien no paga, cambia su contraseña con el script.

### Reglas

- Cada HTML lleva `<meta name="robots" content="noindex,nofollow">`.
- No agregues carpetas de clientas a `sitemap.xml` ni a `robots.txt`.
- Usa contraseñas largas (12+). Las cortas se pueden adivinar.
