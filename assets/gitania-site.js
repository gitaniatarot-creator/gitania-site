/* Gitania: comportamiento base del sitio (extraído de vip.html): aparición al hacer scroll,
   chispitas, pulso de los círculos, giro 3D con GSAP y cursor de polvo de estrellas. */
(function () {
  "use strict";
  var leftRail = document.querySelector(".side-nav--left");
  if (leftRail) leftRail.classList.add("is-visible");
// ---- chispitas mágicas: un pequeño estallido de luz cada vez que ----
  // ---- una sección aparece al hacer scroll.                       ----
  function spawnMagicBurst(x, y) {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = "magic-spark" + (Math.random() < 0.35 ? " is-red" : "");

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.6 - 0.3);
      const distance = 34 + Math.random() * 46;
      const mx = Math.cos(angle) * distance;
      const my = Math.sin(angle) * distance;

      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.setProperty("--mx", mx.toFixed(1) + "px");
      spark.style.setProperty("--my", my.toFixed(1) + "px");
      spark.style.setProperty("--ms", (0.6 + Math.random() * 0.8).toFixed(2));
      spark.style.animationDelay = (Math.random() * 120).toFixed(0) + "ms";

      document.body.appendChild(spark);
      spark.addEventListener("animationend", function () {
        spark.remove();
      });
      // Respaldo por si el navegador no dispara animationend (pestaña en segundo plano, etc.)
      window.setTimeout(function () {
        if (spark.isConnected) spark.remove();
      }, 1600);
    }
  }

  // ---- supernova: estallido grande cuando el círculo de un servicio aparece ----
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- shadow-pop (animista.net) cuando el círculo de un servicio aparece ----
  if (!reduceMotion && "IntersectionObserver" in window) {
    const popEls = Array.from(document.querySelectorAll(".portal-button"));
    const popObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            popObserver.unobserve(entry.target);
            entry.target.classList.add("do-pop");
          }
        });
      },
      { threshold: 0.5 }
    );
    popEls.forEach(function (el) { popObserver.observe(el); });
  } else {
    document.querySelectorAll(".portal-button").forEach(function (el) { el.classList.add("do-pop"); });
  }

  // ---- scroll reveal de cada sección ----
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  const magicBurstSelector = ".section-inner, .oracle-inner";

  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);

            if (entry.target.matches(magicBurstSelector)) {
              const rect = entry.target.getBoundingClientRect();
              spawnMagicBurst(rect.left + rect.width / 2, rect.top + 24);
            }
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---- el parpadeo de Gitania avanza con el scroll, no solo. ----
  (function () {
    const blinkImg = document.getElementById("gitaniaBlinkImg");
    if (!blinkImg) return;

    const FRAME_COUNT = 8;
    const CYCLE_PX = 500; // cuántos px de scroll = un parpadeo completo
    const frameSrcs = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      frameSrcs.push("assets/portrait/blink-frames/frame-" + i + ".webp");
    }
    // precarga
    frameSrcs.forEach(function (src) {
      const im = new Image();
      im.src = src;
    });

    let currentFrame = -1;
    let ticking = false;

    function updateBlinkFrame() {
      const y = window.scrollY || window.pageYOffset;
      const progress = (y % CYCLE_PX) / CYCLE_PX; // 0..1
      const frame = Math.floor(progress * FRAME_COUNT) % FRAME_COUNT;
      if (frame !== currentFrame) {
        currentFrame = frame;
        blinkImg.src = frameSrcs[frame];
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateBlinkFrame);
      },
      { passive: true }
    );

    updateBlinkFrame();
  })();


  // ---- GSAP: los círculos reaccionan al cursor (tilt 3D) y giran con el scroll ----
  if (window.gsap && !reduceMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll(".portal-button").forEach(function (btn) {
      const ring = btn.querySelector(".portal-ring");
      if (!ring) return;

      // tilt 3D siguiendo el cursor, como una tarjeta flotante
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(ring, {
          rotateY: px * 22,
          rotateX: py * -22,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", function () {
        gsap.to(ring, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
      });

      // giro sutil ligado al scroll: entra girado, se endereza al centrar la sección
      if (window.ScrollTrigger) {
        gsap.fromTo(
          ring,
          { rotateZ: -14 },
          {
            rotateZ: 14,
            ease: "none",
            scrollTrigger: {
              trigger: btn,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }
    });
  }
  
  /* ---------------- Cursor: esfera blanca chispeante con estela ---------------- */
  (function () {
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;

    const orb = document.createElement("div");
    orb.className = "cursor-orb";
    document.body.appendChild(orb);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let orbX = targetX;
    let orbY = targetY;
    let started = false;
    let lastTrail = 0;
    const TRAIL_INTERVAL = 22;

    function spawnTrailDot(x, y) {
      const el = document.createElement("span");
      el.className = "stardust-sparkle";
      const size = 3 + Math.random() * 3;
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.left = x + "px";
      el.style.top = y + "px";
      document.body.appendChild(el);

      el.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0.9 },
          { transform: "translate(-50%, -50%) scale(0.2)", opacity: 0 },
        ],
        { duration: 420, easing: "ease-out" }
      ).onfinish = () => el.remove();
    }

    function tick() {
      orbX += (targetX - orbX) * 0.22;
      orbY += (targetY - orbY) * 0.22;
      orb.style.transform = "translate(" + orbX + "px, " + orbY + "px) translate(-50%, -50%)";
      if (started) orb.style.opacity = "1";

      const now = performance.now();
      if (started && now - lastTrail > TRAIL_INTERVAL) {
        lastTrail = now;
        spawnTrailDot(orbX, orbY);
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!started) {
          started = true;
          orbX = targetX;
          orbY = targetY;
          document.body.classList.add("cursor-ready");
        }
      },
      { passive: true }
    );

    requestAnimationFrame(tick);
  })();

  
})();
