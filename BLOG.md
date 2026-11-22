# Blog de Gitania: estructura trilingüe (ES / EN / FR)

**Regla:** toda entrada se publica completa en español, inglés y francés, con el mismo selector de idioma del sitio (ES · EN · FR). Nunca se publica una entrada solo en español ni se escribe “en español”, “in Spanish” o “en espagnol” en ningún enlace o texto.

Esto aplica a la rutina diaria del blog y a cualquier entrada manual.

## Cómo funciona

- Una sola URL por entrada: `blog/<slug>.html` (no hay URLs por idioma, así que no se usa `hreflang`).
- El idioma se guarda en `localStorage["gitania_lang"]`. Es la misma preferencia que usa todo el sitio, así que el idioma elegido en el inicio se mantiene en el blog y al revés.
- `assets/gitania-i18n.js` hace tres cosas:
  1. Muestra solo el bloque `[data-lang="<idioma>"]` y oculta los demás.
  2. Traduce los elementos con `data-t="clave"` (menú) usando `window.GITANIA_I18N.k`.
  3. Cambia `<title>` y la meta description con `GITANIA_I18N.title` y `GITANIA_I18N.desc`, y pinta los botones en `#langbar`.
- Sin JavaScript se ve el español: los bloques EN y FR llevan el atributo `hidden`.

## Archivo de la entrada (`blog/<slug>.html`)

Parte de `blog/_plantilla.html`, que ya trae la estructura:

```html
<article class="post" data-lang="es" lang="es"> … texto completo en español … </article>
<article class="post" data-lang="en" lang="en" hidden> … texto completo en inglés … </article>
<article class="post" data-lang="fr" lang="fr" hidden> … texto completo en francés … </article>
```

Cada `<article>` lleva su propia versión de: migas (Inicio/Home/Accueil), sección, H1, bajada, fecha, `alt` y pie de la imagen, cuerpo, bloque de lectura (CTA) con el aviso y la Línea de la Vida, fuentes y nota de traducciones. El pie de página también tiene tres `<span data-lang>`.

Al final del `<body>`:

```html
<script>window.GITANIA_I18N={"k":{…menú…},"js":{},"title":{"en":"… | Gitania","fr":"… | Gitania"},"desc":{"en":"…","fr":"…"}};</script>
<script src="../assets/gitania-i18n.js?v=2"></script>
```

En el `<head>`, el `<title>`, la description, `og:*`, `twitter:*` y el JSON-LD van en español (idioma principal). `inLanguage` es `["es", "en", "fr"]`, con `og:locale:alternate` `en_US` y `fr_FR`.

## Índice (`blog.html`)

Cada tarjeta nueva entre `<!-- POSTS:START -->` y `<!-- POSTS:END -->` usa claves `data-i18n`:

```html
<li class="post-card">
  <a href="blog/<slug>.html">
    <p class="post-meta" data-i18n="post.<id>.meta"><time datetime="AAAA-MM-DD">17 nov 2026</time> · Historia del tarot</p>
    <h2 data-i18n="post.<id>.title">Título en español</h2>
    <p class="post-excerpt" data-i18n="post.<id>.excerpt">Resumen en español</p>
  </a>
</li>
```

Agrega las tres claves (`post.<id>.meta`, `.title`, `.excerpt`) en los tres bloques `es`, `en` y `fr` del objeto `STRINGS` de `blog.html`, junto a `"blog.empty"`. Si se enlaza la entrada desde el inicio (`index.html`), su texto también va en los tres idiomas.

## Reglas de traducción

- Fiel al español: mismos datos, mismas fuentes, mismas citas y mismo orden. No se agregan ni se quitan datos.
- Natural, no literal: inglés y francés idiomáticos. El francés tutea, igual que el sitio.
- Citas: si la fuente original está en inglés, en EN se usa la cita **textual del original**, y en ES y FR se traduce con la nota “(traducción propia)” / “(notre traduction)”. Nunca inventes una cita ni la “mejores”.
- Títulos de libros: se dejan en su idioma original. Si se traduce un título para explicarlo, va como “se traduce más o menos como…”.
- Marca: lectura simbólica para la reflexión, la introspección y el autoconocimiento / *symbolic reading for reflection, introspection and self-knowledge* / *lecture symbolique pour la réflexion, l’introspection et la connaissance de soi*. Nunca terapia, predicción, adivinación como servicio, ni promesas de sanar. Se dice “consultantes”.
- El precio de la Lectura Express es siempre **$444 MXN** (EN “Get my Express Reading · $444 MXN”, FR “Demander ma Lecture Express · 444 MXN”).

## Tono y voz

- El sesgo de la marca es artístico. La voz de cada entrada es la de un texto de arte contemporáneo: evocativa, precisa, sensorial, reflexiva, guiada por la imagen. No es un tono académico-correctivo ni esotérico cursi.
- Los datos duros, las citas y las fuentes se mantienen intactos. Nunca se inventan. Un post no debe socavar la oferta de Gitania (lectura simbólica, oráculo sonoro Melomancia, joyas programadas, sincronía).
- Los mitos se presentan como tradiciones vivas, con valor artístico y simbólico. Se cierra abriendo el sentido, no cerrándolo: los documentos dicen de dónde vienen las cartas o las ideas, pero no agotan lo que ocurre cuando alguien las lee. Se deja margen al misterio.
- Se evitan títulos que desmienten o juzgan (por ejemplo «Por qué es un mito», «por qué no se sostiene»). Se prefieren formulaciones como «Lo que dicen los documentos».
- Si se menciona el nombre Gitania o la figura de la gitana, se honra como tradición artística y cultural viva (una imagen poderosa en el arte, la literatura y el cine), no como un desmentido de la marca.

## Lista de revisión antes de subir

1. `python3 -m http.server 8000` y abre la entrada. Cambia ES → EN → FR con los botones: solo debe verse un `<article>`, y deben cambiar el título de la pestaña, el H1 y el menú.
2. Revisa el índice `blog.html` en los tres idiomas.
3. `grep -i "in spanish\|en espagnol\|solo en español"` no debe encontrar nada.
4. Revisa en móvil (390 px) y escritorio (1440 px).
5. Agrega la URL a `sitemap.xml` y sube con la cuenta de Gitania (`gitaniatarot-creator`).
