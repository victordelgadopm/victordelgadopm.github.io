(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  $("#year").textContent = new Date().getFullYear();

  // Scroll progress and nav background
  const progress = $(".progress");
  const nav = $(".nav");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle("is-scrolled", scrollY > 20);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Run a callback once an element scrolls into view
  const whenVisible = (el, fn, threshold = 0.3) => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); }
    }), { threshold });
    io.observe(el);
  };
  // Track visibility continuously (for looping animations)
  const trackVisible = (el, onChange) => {
    new IntersectionObserver((entries) => entries.forEach((e) => onChange(e.isIntersecting)), { threshold: 0.25 }).observe(el);
  };

  $$(".reveal").forEach((el) => whenVisible(el, (t) => t.classList.add("is-in"), 0.12));

  // Active nav link
  const links = $$(".nav__links a");
  const sectionIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => sectionIO.observe(s));

  // Typing rotator
  const word = $(".rotator__word");
  const phrases = ["customer insight", "market research", "customer reviews", "unmet demand", "business needs"];
  if (!reduceMotion) {
    let i = 0, ch = phrases[0].length, deleting = false;
    const tick = () => {
      if (!deleting) {
        ch++;
        if (ch > phrases[i].length) { deleting = true; return setTimeout(tick, 1800); }
      } else {
        ch--;
        if (ch === 0) { deleting = false; i = (i + 1) % phrases.length; }
      }
      word.textContent = phrases[i].slice(0, ch);
      setTimeout(tick, deleting ? 35 : 70);
    };
    setTimeout(() => { deleting = true; tick(); }, 2600);
  }

  // Video
  const video = $("#resumeVideo");
  const screen = video.closest(".screen");
  $(".video__play").addEventListener("click", () => video.play());
  video.addEventListener("play", () => screen.classList.add("is-playing"));
  video.addEventListener("ended", () => screen.classList.remove("is-playing"));

  // Copy email
  const toast = $(".toast");
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("is-on"), 2200);
  };
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("vtdelg@gmail.com"); showToast("Email copied. Talk soon!"); }
    catch { showToast("vtdelg@gmail.com"); }
  });

  // ---------- RVToad marketplace ----------
  {
    const fig = $(".viz--market");
    const nodes = $$(".node", fig);
    const tip = $(".viz__tip", fig);
    let idx = -1, timer, touched = false;
    const select = (n) => {
      nodes.forEach((x) => x.classList.toggle("is-on", x === n));
      tip.textContent = n.dataset.tip;
    };
    nodes.forEach((n) => n.addEventListener("click", () => { touched = true; clearInterval(timer); select(n); }));
    trackVisible(fig, (on) => {
      clearInterval(timer);
      if (on && !touched && !reduceMotion) timer = setInterval(() => { idx = (idx + 1) % nodes.length; select(nodes[idx]); }, 2600);
    });
  }

  // ---------- Kolo agent orbit ----------
  {
    const fig = $(".viz--agents");
    const orbit = $(".orbit", fig);
    const agents = $$(".agent", fig);
    const steps = $$(".lifecycle li", fig);
    const tip = $(".viz__tip", fig);
    let run = 0, auto, touched = false, idx = -1;
    const play = (a) => {
      const id = ++run;
      agents.forEach((x) => x.classList.toggle("is-on", x === a));
      orbit.classList.add("is-running");
      steps.forEach((s) => s.classList.remove("is-on", "is-done"));
      tip.textContent = `${a.textContent}: taking it from research to launch.`;
      steps.forEach((s, i) => setTimeout(() => {
        if (id !== run) return;
        steps.forEach((x, j) => { x.classList.toggle("is-on", j === i); x.classList.toggle("is-done", j < i); });
        if (i === steps.length - 1) setTimeout(() => { if (id === run) orbit.classList.remove("is-running"); }, 600);
      }, i * 520));
    };
    agents.forEach((a) => a.addEventListener("click", () => { touched = true; clearInterval(auto); play(a); }));
    trackVisible(fig, (on) => {
      clearInterval(auto);
      if (on && !touched && !reduceMotion) {
        const next = () => { idx = (idx + 1) % agents.length; play(agents[idx]); };
        next();
        auto = setInterval(next, 3800);
      }
    });
  }

  // ---------- Infinite pipeline ----------
  {
    const pipe = $(".pipeline");
    const items = $$("li", pipe);
    const bar = $(".pipeline__bar", pipe);
    let i = -1, timer;
    const step = () => {
      i = (i + 1) % (items.length + 2);
      const cur = Math.min(i, items.length - 1);
      items.forEach((li, j) => { li.classList.toggle("is-on", j === cur && i < items.length); li.classList.toggle("is-done", j < cur || i >= items.length); });
      bar.style.setProperty("--p", cur / (items.length - 1));
    };
    if (reduceMotion) { i = items.length; step(); }
    else trackVisible(pipe, (on) => { clearInterval(timer); if (on) { step(); timer = setInterval(step, 1100); } });
  }

  // ---------- Tabs ----------
  $$("[data-tabs]").forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const show = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });

  // ---------- Aki Home room ----------
  {
    const room = $(".room");
    const legend = $$(".room__legend button");
    whenVisible(room, () => room.classList.add("is-built"), 0.35);
    legend.forEach((b) => b.addEventListener("click", () => {
      const on = !b.classList.contains("is-on");
      legend.forEach((x) => x.classList.toggle("is-on", on && x === b));
      room.classList.toggle("has-focus", on);
      $$(".item", room).forEach((it) => it.classList.toggle("is-focus", on && it.dataset.cat === b.dataset.cat));
    }));
    $('[data-replay="room"]').addEventListener("click", () => {
      legend.forEach((x) => x.classList.remove("is-on"));
      room.classList.remove("has-focus", "is-built");
      void room.getBoundingClientRect();
      room.classList.add("is-built");
    });
  }

  // ---------- Planogram ----------
  {
    const plano = $("#plano");
    const icons = {
      furniture: '<path d="M5 13v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><path d="M3 13h18v4H3z"/><path d="M5 17v2M19 17v2"/>',
      rugs: '<rect x="5" y="4" width="14" height="16" rx="1"/><rect x="8.5" y="7.5" width="7" height="9"/>',
      curtains: '<path d="M3 4h18"/><path d="M6 4c3 5 3 11 0 16"/><path d="M18 4c-3 5-3 11 0 16"/>',
      decor: '<path d="M9 3h6l2 6H7z"/><path d="M12 9v9"/><path d="M8 21h8"/>',
      art: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 16l5-5 4 4 3-3 4 4"/>',
    };
    const zones = [
      { cat: "art", label: "Art", n: 3 },
      { cat: "furniture", label: "Furniture", n: 6 },
      { cat: "rugs", label: "Rugs", n: 5 },
      { cat: "decor", label: "Decor", n: 5 },
      { cat: "curtains", label: "Window", n: 3 },
    ];
    // Zone rectangles in percent of the floor plan [x, y, w, h], one layout per store
    const layouts = [
      { art: [3, 4, 44, 19], furniture: [3, 27, 44, 45], rugs: [51, 4, 27, 42], decor: [51, 50, 27, 30], curtains: [81, 4, 16, 70] },
      { rugs: [3, 4, 31, 38], art: [37, 4, 15, 68], furniture: [55, 4, 42, 44], curtains: [3, 46, 31, 30], decor: [55, 52, 42, 26] },
    ];
    const zoneEls = {};
    const skus = [];
    zones.forEach((z) => {
      const el = document.createElement("div");
      el.className = `zone zone--${z.cat}`;
      el.innerHTML = `<span>${z.label}</span>`;
      plano.appendChild(el);
      zoneEls[z.cat] = el;
      for (let i = 0; i < z.n; i++) {
        const s = document.createElement("div");
        s.className = `sku sku--${z.cat}`;
        s.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[z.cat]}</svg>`;
        s.dataset.cat = z.cat;
        plano.appendChild(s);
        skus.push(s);
      }
    });
    let store = 0, stocked = false;
    const place = (instant) => {
      const W = plano.clientWidth, H = plano.clientHeight;
      const gap = Math.max(3, W * 0.01), labelH = Math.max(14, H * 0.075);
      // Largest tile size that fits every zone in both store layouts
      const fits = (s) => layouts.every((lay) => zones.every((z) => {
        const [, , w, h] = lay[z.cat];
        const cols = Math.floor(((w / 100) * W - gap) / (s + gap));
        const rows = Math.floor(((h / 100) * H - labelH - gap) / (s + gap));
        return cols * rows >= z.n;
      }));
      let size = W * 0.07;
      while (size > 8 && !fits(size)) size -= 1;
      skus.forEach((s) => { s.style.width = `${size}px`; });
      const L = layouts[store];
      const count = {};
      Object.entries(L).forEach(([cat, [x, y, w, h]]) => {
        Object.assign(zoneEls[cat].style, { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` });
      });
      skus.forEach((s, k) => {
        const [x, y, w] = L[s.dataset.cat];
        const i = (count[s.dataset.cat] = (count[s.dataset.cat] || 0) + 1) - 1;
        const zx = (x / 100) * W + gap, zy = (y / 100) * H + labelH;
        const cols = Math.max(1, Math.floor(((w / 100) * W - gap) / (size + gap)));
        s.style.transitionDelay = instant ? "0s" : `${k * 0.05}s`;
        if (!stocked) {
          s.style.left = `${W / 2 - size / 2}px`;
          s.style.top = `${H - size}px`;
          s.style.opacity = "0";
        } else {
          s.style.left = `${zx + (i % cols) * (size + gap)}px`;
          s.style.top = `${zy + Math.floor(i / cols) * (size + gap)}px`;
          s.style.opacity = "1";
        }
      });
    };
    place(true);
    const restock = () => {
      stocked = false; place(true);
      requestAnimationFrame(() => requestAnimationFrame(() => { stocked = true; place(false); }));
    };
    whenVisible(plano, restock, 0.4);
    $$(".seg button").forEach((b) => b.addEventListener("click", () => {
      store = +b.dataset.store;
      $$(".seg button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      stocked = true; place(false);
    }));
    $('[data-replay="plano"]').addEventListener("click", restock);
    addEventListener("resize", () => place(true));
  }

  if (reduceMotion || !finePointer) return;

  // Magnetic buttons
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });

  // Photo tilt
  const photo = $(".tilt");
  const hero = $(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = photo.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    photo.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  hero.addEventListener("pointerleave", () => { photo.style.transform = ""; });
})();
