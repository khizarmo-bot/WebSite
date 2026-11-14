/* KM Ascend Advisory — site behaviour (vanilla JS, no build step) */

/* ------------------------------------------------------------------
   CONTACT FORM SETTINGS — edit these two lines
   FORM_ENDPOINT : your Formspree form URL, e.g. "https://formspree.io/f/abcdwxyz"
                   (free at formspree.io — enquiries are emailed to you).
   CONTACT_EMAIL : used as a fallback if FORM_ENDPOINT is empty — the
                   visitor's email app opens with the enquiry pre-filled.
------------------------------------------------------------------- */
const FORM_ENDPOINT = "https://formsubmit.co/ajax/khizar@kmascend.com";
const CONTACT_EMAIL = "khizar@kmascend.com";

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, "0");
  const swap = (el, from, to) => {
    from.split(" ").filter(Boolean).forEach((c) => el.classList.remove(c));
    to.split(" ").filter(Boolean).forEach((c) => el.classList.add(c));
  };

  /* ---------- Header: scrolled state + mobile menu ---------- */
  const header = $("#site-header");
  const logo = $("#header-logo");
  const menuBtn = $("#menu-btn");
  const mobileMenu = $("#mobile-menu");
  let scrolled = false, menuOpen = false;

  function paintHeader() {
    const solid = scrolled || menuOpen;
    if (solid) swap(header, "border-rule-navy bg-transparent", "border-border bg-background/95 backdrop-blur");
    else swap(header, "border-border bg-background/95 backdrop-blur", "border-rule-navy bg-transparent");
    logo.src = solid ? logo.dataset.dark : logo.dataset.light;
    $$("[data-tone]", header).forEach((el) => {
      if (solid) swap(el, "text-on-navy", "text-foreground");
      else swap(el, "text-foreground", "text-on-navy");
      if (el.hasAttribute("data-tone-border")) {
        if (solid) swap(el, "border-on-navy", "border-foreground");
        else swap(el, "border-foreground", "border-on-navy");
      }
    });
  }
  const onScroll = () => { const s = window.scrollY > 40; if (s !== scrolled) { scrolled = s; paintHeader(); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); paintHeader();

  menuBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.hidden = !menuOpen;
    menuBtn.textContent = menuOpen ? "Close" : "Menu";
    menuBtn.setAttribute("aria-expanded", String(menuOpen));
    paintHeader();
  });
  $$("a", mobileMenu).forEach((a) => a.addEventListener("click", () => {
    menuOpen = false; mobileMenu.hidden = true; menuBtn.textContent = "Menu";
    menuBtn.setAttribute("aria-expanded", "false"); paintHeader();
  }));

  /* ---------- In-view helper (threshold 0.2, fires once) ---------- */
  function onceInView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e && e.isIntersecting) { cb(); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
  }

  /* ---------- Hero graphic ---------- */
  (function buildHero() {
    const svg = $("#hero-graphic");
    if (!svg) return;
    const pts = [[80,120],[260,60],[420,160],[200,260],[380,340],[120,420],[300,480],[460,440]];
    let h = '<g class="animate-drift"><circle cx="270" cy="280" r="220" stroke="currentColor" stroke-opacity="0.18"></circle><circle cx="270" cy="280" r="150" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="2 6"></circle></g>';
    for (let i = 0; i < 7; i++) { const x = 40 + i * 76; h += `<line x1="${x}" y1="20" x2="${x}" y2="540" stroke="currentColor" stroke-opacity="0.06"></line>`; }
    [[0,1],[1,2],[0,3],[3,2],[3,4],[2,4],[3,5],[5,6],[4,6],[6,7],[4,7]].forEach(([a, b], i) => {
      h += `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.8" class="animate-draw" style="animation-delay:${(0.4 + i * 0.12).toFixed(2)}s"></line>`;
    });
    h += '<path d="M40 520 L140 470 L220 490 L300 400 L380 410 L500 260" stroke="currentColor" stroke-width="1.4" class="animate-draw" style="animation-delay:1.4s"></path>';
    pts.forEach(([x, y], n) => {
      h += `<g><rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="currentColor" class="animate-pulse-dot" style="animation-delay:${(n * 0.35).toFixed(2)}s"></rect><text x="${x + 10}" y="${y - 8}" fill="currentColor" fill-opacity="0.4" font-size="9" font-family="Work Sans" letter-spacing="2">${pad(n + 1)}</text></g>`;
    });
    h += '<rect x="490" y="250" width="20" height="20" stroke="currentColor"></rect>';
    svg.innerHTML = h;
  })();

  /* ---------- Challenges carousel ---------- */
  (function carousel() {
    const root = $("#challenges-carousel");
    const slides = $$("[data-slide]", root);
    const dots = $$("[data-dot]", root);
    const cur = $("[data-slide-current]", root);
    const n = slides.length;
    let idx = 0, paused = false, timer = null;

    function render() {
      slides.forEach((s, i) => {
        swap(s, "translate-y-0 opacity-100 -translate-y-6 translate-y-6 opacity-0", "");
        if (i === idx) swap(s, "", "translate-y-0 opacity-100");
        else if (i < idx) swap(s, "", "-translate-y-6 opacity-0");
        else swap(s, "", "translate-y-6 opacity-0");
        s.setAttribute("aria-hidden", String(i !== idx));
      });
      dots.forEach((d, i) => {
        if (i === idx) swap(d, "bg-rule-navy", "bg-on-navy");
        else swap(d, "bg-on-navy", "bg-rule-navy");
      });
      cur.textContent = pad(idx + 1);
    }
    function go(i) { idx = (i + n) % n; render(); restart(); }
    function restart() {
      clearInterval(timer);
      if (!paused) timer = setInterval(() => { idx = (idx + 1) % n; render(); }, 4200);
    }
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    $("[data-prev]", root).addEventListener("click", () => go(idx - 1));
    $("[data-next]", root).addEventListener("click", () => go(idx + 1));
    root.addEventListener("mouseenter", () => { paused = true; clearInterval(timer); });
    root.addEventListener("mouseleave", () => { paused = false; restart(); });
    render(); restart();
  })();

  /* ---------- Results counters ---------- */
  (function counters() {
    const wrap = $("#stats");
    const els = $$("[data-count]", wrap);
    function fmt(el, v) {
      const d = +el.dataset.decimals;
      const txt = el.dataset.format ? Math.round(v).toLocaleString("en-IN") : v.toFixed(d);
      el.textContent = el.dataset.prefix + txt + el.dataset.suffix;
    }
    onceInView(wrap, () => {
      els.forEach((el) => {
        const target = parseFloat(el.dataset.value);
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / 1800);
          fmt(el, target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  })();

  /* ---------- Collapsible helper ---------- */
  const collapse = (open, inner) =>
    `<div class="grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}" data-collapse><div class="overflow-hidden">${inner}</div></div>`;
  const setCollapse = (el, open) => {
    if (open) swap(el, "grid-rows-[0fr] opacity-0", "grid-rows-[1fr] opacity-100");
    else swap(el, "grid-rows-[1fr] opacity-100", "grid-rows-[0fr] opacity-0");
  };

  /* ---------- Services ---------- */
  (function services() {
    const data = [
      { t: "IT Strategy & Roadmap", b: ["Align technology with business goals", "Business technology blueprint with ROI", "Vendor evaluation & governance design"] },
      { t: "Operating Model Redesign", b: ["Move from people-heavy to tech-first", "Automate manual process touchpoints", "Scale volume without scaling headcount"] },
      { t: "Digital & AI Enablement", b: ["AI-assisted credit, customer service", "Democratization of sales function", "Collections prediction & EWS"] },
      { t: "Cybersecurity & Compliance", b: ["RBI, DPDP, PCI DSS readiness", "IT audits & governance framework", "Risk management and data protection"] },
      { t: "Fractional CTO / Advisory", b: ["Senior tech leadership without full-time cost", "Own the roadmap, team, and vendor mgmt.", "2-3 days/week embedded alongside team"] },
      { t: "Executive Workshops", b: ["AI & technology strategy for boards & CEOs", "IT governance, budgeting, and ROI", "Half-day or full-day bespoke sessions"] },
    ];
    const esc = (s) => s.replace(/&/g, "&amp;");
    const grid = $("#services-grid");
    let open = 0;
    grid.innerHTML = data.map((s, i) => {
      const o = i === open;
      const items = s.b.map((x) => `<li class="flex gap-3 leading-relaxed text-muted-foreground"><span class="font-label text-foreground">›</span>${esc(x)}</li>`).join("");
      return `<button type="button" aria-expanded="${o}" class="group relative h-full border-b border-r border-foreground/20 p-8 text-left transition-colors duration-500 md:p-10 ${o ? "bg-background" : "hover:bg-background/60"}">
        <span data-line class="absolute left-0 top-0 h-px bg-foreground transition-all duration-700 ${o ? "w-full" : "w-0 group-hover:w-1/4"}"></span>
        <div class="flex items-start justify-between"><span class="font-display text-5xl text-foreground/25 transition-colors group-hover:text-foreground/60 md:text-6xl">${pad(i + 1)}</span><span data-plus class="label mt-2 transition-transform duration-500 ${o ? "rotate-45" : ""}">+</span></div>
        <div class="label mt-10 text-muted-foreground">Service ${pad(i + 1)}</div>
        <h3 class="mt-3 text-2xl font-bold leading-tight">${esc(s.t)}</h3>
        ${collapse(o, `<ul class="mt-6 space-y-3 border-t border-border pt-6">${items}</ul>`)}
      </button>`;
    }).join("");
    const cards = $$("button", grid);
    function render() {
      cards.forEach((c, i) => {
        const o = i === open;
        c.setAttribute("aria-expanded", String(o));
        if (o) swap(c, "hover:bg-background/60", "bg-background"); else swap(c, "bg-background", "hover:bg-background/60");
        const line = $("[data-line]", c);
        if (o) swap(line, "w-0 group-hover:w-1/4", "w-full"); else swap(line, "w-full", "w-0 group-hover:w-1/4");
        $("[data-plus]", c).classList.toggle("rotate-45", o);
        setCollapse($("[data-collapse]", c), o);
      });
    }
    cards.forEach((c, i) => c.addEventListener("click", () => { open = open === i ? null : i; render(); }));
  })();

  /* ---------- Approach ---------- */
  (function approach() {
    const data = [
      { t: "Business Technology Advisory", d: "Assess business goals, map processes, and define a technology-integrated blueprint with clear, measurable outcomes." },
      { t: "Implementation & Governance", d: "Vendor evaluation, project prioritization, PMO setup, and hands-on execution oversight with delivery governance." },
      { t: "Coaching & Workshops", d: "Half-day or full-day workshops for leadership on technology trends, AI, IT budgeting, governance, and ROI tracking." },
    ];
    const list = $("#approach-list");
    let open = 0;
    list.insertAdjacentHTML("beforeend", data.map((s, i) => {
      const o = i === open;
      return `<button type="button" aria-expanded="${o}" class="group relative block w-full border-b border-border py-8 pl-8 text-left">
        <span data-dot class="absolute -left-[3px] mt-2 h-[7px] w-[7px] transition-colors ${o ? "bg-foreground" : "bg-border"}"></span>
        <div class="flex items-baseline gap-8">
          <span data-num class="font-label text-sm tabular-nums transition-colors ${o ? "text-foreground" : "text-muted-foreground"}">${pad(i + 1)}</span>
          <h3 data-title class="flex-1 text-2xl transition-all duration-500 md:text-3xl ${o ? "font-bold" : "font-light text-muted-foreground group-hover:text-foreground"}">${s.t.replace(/&/g, "&amp;")}</h3>
          <span data-arrow class="label transition-transform duration-500 ${o ? "rotate-90" : ""}">→</span>
        </div>
        ${collapse(o, `<p class="ml-[3.25rem] mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">${s.d}</p>`)}
      </button>`;
    }).join(""));
    const rows = $$("button", list);
    function render() {
      rows.forEach((r, i) => {
        const o = i === open;
        r.setAttribute("aria-expanded", String(o));
        const dot = $("[data-dot]", r), num = $("[data-num]", r), title = $("[data-title]", r);
        if (o) swap(dot, "bg-border", "bg-foreground"); else swap(dot, "bg-foreground", "bg-border");
        if (o) swap(num, "text-muted-foreground", "text-foreground"); else swap(num, "text-foreground", "text-muted-foreground");
        if (o) swap(title, "font-light text-muted-foreground group-hover:text-foreground", "font-bold");
        else swap(title, "font-bold", "font-light text-muted-foreground group-hover:text-foreground");
        $("[data-arrow]", r).classList.toggle("rotate-90", o);
        setCollapse($("[data-collapse]", r), o);
      });
    }
    rows.forEach((r, i) => r.addEventListener("click", () => { open = i; render(); }));
  })();

  /* ---------- Scroll reveal ---------- */
  $$(".reveal").forEach((el) => onceInView(el, () => el.classList.add("is-in")));

  /* ---------- Contact form ---------- */
  (function form() {
    const f = $("#enquiry-form");
    const thanks = $("#form-thanks");
    const err = $("#form-error");
    const done = () => { f.hidden = true; thanks.hidden = false; };
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.hidden = true;
      const data = new FormData(f);
      if (data.get("_honey")) return;
      data.append("_subject", "Website enquiry — " + data.get("name"));
      data.append("_template", "table");
      data.append("_captcha", "false");
      data.append("_replyto", data.get("email"));
      const btn = f.querySelector("button[type=submit]");
      if (FORM_ENDPOINT) {
        btn.disabled = true;
        try {
          const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error();
          done();
        } catch (_) {
          btn.disabled = false;
          err.innerHTML = 'Sorry, something went wrong. Please email us at <a class="border-b border-on-navy" href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.';
          err.hidden = false;
        }
      } else if (CONTACT_EMAIL) {
        const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${data.get("company") || ""}\n\n${data.get("message") || ""}`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Website enquiry — " + data.get("name"))}&body=${encodeURIComponent(body)}`;
        done();
      } else {
        done(); // same behaviour as the original site (no delivery configured)
      }
    });
  })();

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
