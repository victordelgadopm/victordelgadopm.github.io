(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Scroll progress, nav background and timeline fill
  const progress = document.querySelector(".progress");
  const nav = document.querySelector(".nav");
  const timeline = document.querySelector(".timeline");
  const timelineFill = document.querySelector(".timeline__line");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle("is-scrolled", scrollY > 20);

    const r = timeline.getBoundingClientRect();
    const p = (innerHeight * 0.6 - r.top) / r.height;
    timelineFill.style.setProperty("--p", Math.min(Math.max(p, 0), 1));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Active nav link
  const links = [...document.querySelectorAll(".nav__links a")];
  const sectionIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
      }
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("section[id]").forEach((s) => sectionIO.observe(s));

  // Typing rotator
  const word = document.querySelector(".rotator__word");
  const phrases = ["customer insight", "market research", "a clear roadmap", "smart pricing", "AI workflows"];
  if (reduceMotion) {
    word.textContent = phrases[0];
  } else {
    let i = 0, ch = phrases[0].length, deleting = false;
    const tick = () => {
      const target = phrases[i];
      if (!deleting) {
        ch++;
        if (ch > target.length) { deleting = true; return setTimeout(tick, 1800); }
      } else {
        ch--;
        if (ch === 0) { deleting = false; i = (i + 1) % phrases.length; }
      }
      word.textContent = phrases[i].slice(0, ch);
      setTimeout(tick, deleting ? 35 : 70);
    };
    setTimeout(() => { deleting = true; tick(); }, 2600);
  }

  // Video play button
  const video = document.getElementById("resumeVideo");
  const phone = video.closest(".phone");
  const playBtn = document.querySelector(".video__play");
  playBtn.addEventListener("click", () => video.play());
  video.addEventListener("play", () => phone.classList.add("is-playing"));
  video.addEventListener("pause", () => { if (video.currentTime === 0 || video.ended) phone.classList.remove("is-playing"); });
  video.addEventListener("ended", () => phone.classList.remove("is-playing"));

  // Copy email
  const toast = document.querySelector(".toast");
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("is-on"), 2200);
  };
  document.getElementById("copyEmail").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("vtdelg@gmail.com");
      showToast("Email copied. Talk soon!");
    } catch {
      showToast("vtdelg@gmail.com");
    }
  });

  if (reduceMotion || !finePointer) return;

  // Cursor spotlight
  const root = document.documentElement;
  addEventListener("pointermove", (e) => {
    root.style.setProperty("--mx", `${e.clientX}px`);
    root.style.setProperty("--my", `${e.clientY}px`);
  }, { passive: true });

  // Magnetic buttons
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });

  // Photo tilt
  const photo = document.querySelector(".tilt");
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = photo.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    photo.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  hero.addEventListener("pointerleave", () => { photo.style.transform = ""; });
})();
