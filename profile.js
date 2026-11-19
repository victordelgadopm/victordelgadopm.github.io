(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = document.querySelector(".side__track span");
  const img = document.querySelector(".side__photo img");
  const desk = matchMedia("(min-width: 1024px)");
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if (track) track.style.setProperty("--p", p.toFixed(4));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  if (img && !reduce) img.addEventListener("animationend", update, { once: true });
  // Reveal headings, steps and duties as they scroll in
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.2 });
  document.querySelectorAll(".step, .duty").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    io.observe(el);
  });
  // Clipped headings: watch their section instead (a fully clipped element never counts as visible)
  const hio = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target._h.classList.add("is-in"); hio.unobserve(e.target); }
  }), { rootMargin: "0px 0px -20% 0px" });
  document.querySelectorAll(".blk__h, .vid h2, .fin__quote").forEach((h) => { const box = h.closest(".blk, .top__video"); box._h = h; hio.observe(box); });
})();
// Once the visitor scrolls past the home hero, the top bar spans the full width
(() => {
  const nav = document.querySelector(".nav"), home = document.getElementById("home");
  if (!nav || !home) return;
  const check = () => nav.classList.toggle("is-past", home.getBoundingClientRect().bottom < 90);
  addEventListener("scroll", check, { passive: true }); addEventListener("resize", check); check();
})();
