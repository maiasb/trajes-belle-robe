(() => {
  const WA_NUMBER = "5591920046319";
  const DEFAULT_MSG = "Olá! Vim pelo site da Belle Robe e quero agendar minha prova.";

  // WhatsApp links (works without JS libs)
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const msg = el.dataset.msg || DEFAULT_MSG;
    el.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });

  // Sticky nav state
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Counters: final values always set, animated only if motion allowed
  const counters = [...document.querySelectorAll(".count")];
  const fmt = (el, v) => (el.textContent = Math.round(v) + (el.dataset.suffix || ""));
  counters.forEach((el) => fmt(el, reduced ? +el.dataset.to : 0));

  if (reduced || !window.gsap || !window.ScrollTrigger) {
    counters.forEach((el) => fmt(el, +el.dataset.to));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out" });

  // Split headings into masked words
  document.querySelectorAll("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words
      .map((w) => `<span class="word" aria-hidden="true"><span>${w}</span></span>`)
      .join(" ");
  });

  document.querySelectorAll("[data-split]").forEach((el) => {
    const isHero = el.classList.contains("hero__title");
    gsap.from(el.querySelectorAll(".word > span"), {
      yPercent: 115,
      rotate: 4,
      duration: 1.2,
      stagger: 0.07,
      delay: isHero ? 0.2 : 0,
      scrollTrigger: isHero ? null : { trigger: el, start: "top 85%" },
    });
  });

  // Fade-up reveals
  gsap.utils.toArray("[data-fade]").forEach((el, i) => {
    const inHero = el.closest(".hero");
    gsap.from(el, {
      y: 30, opacity: 0, duration: 1,
      delay: inHero ? 0.7 + i * 0.12 : 0,
      scrollTrigger: inHero ? null : { trigger: el, start: "top 88%" },
    });
  });

  // Cards stagger in
  gsap.from(".card", {
    y: 60, opacity: 0, duration: 1.1, stagger: 0.12,
    scrollTrigger: { trigger: ".cards", start: "top 80%" },
  });

  // Count-up
  counters.forEach((el) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: +el.dataset.to, duration: 2, ease: "power2.out",
      onUpdate: () => fmt(el, obj.v),
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  // Parallax on hero arches
  document.querySelectorAll(".parallax").forEach((el) => {
    gsap.to(el, {
      y: +el.dataset.depth * -3, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  });

  // 3D tilt + light reflex (pointer devices only)
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5 });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.5 });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        ry((x - 0.5) * 14);
        rx((0.5 - y) * 14);
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }
})();
