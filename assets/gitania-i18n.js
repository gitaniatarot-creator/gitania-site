/* i18n compartido ES / EN / FR para las páginas nuevas (tienda, lectura express, encuesta, mi lectura).
   Usa la misma preferencia guardada que el resto del sitio: localStorage "gitania_lang".
   El diccionario de cada página está en window.GITANIA_I18N = { k: { k1: {en, fr} }, a: {atributos}, js: { "texto es": {en, fr} }, title, desc }. */
(function () {
  "use strict";
  var LANGS = ["es", "en", "fr"], LABEL = { es: "ES", en: "EN", fr: "FR" };
  var D = window.GITANIA_I18N || { k: {}, js: {} };
  var lang = (function () {
    try { var s = localStorage.getItem("gitania_lang"); if (LANGS.indexOf(s) > -1) return s; } catch (e) {}
    var n = ((navigator.language || "es").slice(0, 2)).toLowerCase();
    return LANGS.indexOf(n) > -1 ? n : "es";
  })();
  var ATTRS = [["data-t-ph", "placeholder"], ["data-t-aria", "aria-label"], ["data-t-alt", "alt"], ["data-t-title", "title"]];
  var orig = { title: document.title, desc: "" };
  var md = document.querySelector('meta[name="description"]'); if (md) orig.desc = md.getAttribute("content");
  function pick(entry, es) { return (lang !== "es" && entry && entry[lang]) || es; }
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (el) {
      if (el._es === undefined) el._es = el.innerHTML;
      el.innerHTML = pick(D.k[el.getAttribute("data-t")], el._es);
    });
    ATTRS.forEach(function (p) {
      document.querySelectorAll("[" + p[0] + "]").forEach(function (el) {
        var store = "_es_" + p[1];
        if (el[store] === undefined) el[store] = el.getAttribute(p[1]) || "";
        el.setAttribute(p[1], pick(D.k[el.getAttribute(p[0])], el[store]));
      });
    });
    // Bloques completos por idioma (entradas del blog): <div data-lang="es|en|fr">
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang") !== lang;
    });
    document.title = pick(D.title, orig.title);
    if (md) md.setAttribute("content", pick(D.desc, orig.desc));
    bar();
    try { document.dispatchEvent(new CustomEvent("gitania:lang", { detail: { lang: lang } })); } catch (e) {}
  }
  function bar() {
    var c = document.getElementById("langbar"); if (!c) return;
    c.innerHTML = "";
    LANGS.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "langbtn" + (l === lang ? " active" : ""); b.textContent = LABEL[l]; b.setAttribute("aria-label", l.toUpperCase());
      b.addEventListener("click", function () {
        if (lang === l) return; lang = l;
        try { localStorage.setItem("gitania_lang", l); } catch (e) {}
        apply();
      });
      c.appendChild(b);
    });
  }
  // Textos que pone el JavaScript de la página: T("texto en español")
  window.T = function (es) { return pick((D.js || {})[es], es); };
  window.gitaniaLang = function () { return lang; };
  apply();
})();
