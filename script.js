// ====== Edit these to personalize ======
const ROLES = ["Student Developer", "Web Designer", "Problem Solver", "Lifelong Learner"];
// =======================================

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;

// ---- Typing effect ----
(function typing() {
  const el = $("#typed");
  let r = 0, c = 0, deleting = false;
  function tick() {
    const word = ROLES[r];
    el.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1400); }
    if (deleting && c === 0) { deleting = false; r = (r + 1) % ROLES.length; }
    c += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();

// ---- Theme toggle (remembers choice) ----
const toggle = $("#themeToggle");
function setTheme(t) {
  root.setAttribute("data-theme", t);
  toggle.textContent = t === "dark" ? "🌙" : "☀️";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || "dark");
toggle.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

// ---- Number counters ----
$$("[data-count]").forEach(el => {
  const target = +el.dataset.count, start = performance.now() + 900, dur = 1600;
  (function step(now) {
    if (now < start) return requestAnimationFrame(step);
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
});

// ---- Magnetic buttons ----
$$(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  });
  btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
});

// ---- Custom cursor ----
const cur = $("#cursor"), dot = $("#cursorDot");
let mx = 0, my = 0, cx = 0, cy = 0;
addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + "px"; dot.style.top = my + "px";
});
(function follow() {
  cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
  cur.style.left = cx + "px"; cur.style.top = cy + "px";
  requestAnimationFrame(follow);
})();
$$("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => cur.classList.add("hover"));
  el.addEventListener("mouseleave", () => cur.classList.remove("hover"));
});

// ---- Particle network background ----
(function particles() {
  const canvas = $("#bg"), ctx = canvas.getContext("2d");
  let w, h, pts = [];
  const mouse = { x: null, y: null };
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const n = Math.min(110, Math.floor((w * h) / 14000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, r: Math.random() * 2 + 1
    }));
  }
  addEventListener("resize", resize);
  canvas.parentElement.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });
  resize();
  (function draw() {
    ctx.clearRect(0, 0, w, h);
    const light = root.getAttribute("data-theme") === "light";
    const col = light ? "90,70,220" : "0,224,198";
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},0.8)`;
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(${col},${0.25 * (1 - d / 120)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 160) {
          ctx.strokeStyle = `rgba(124,92,255,${0.5 * (1 - d / 160)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          p.x += (mouse.x - p.x) * 0.004; p.y += (mouse.y - p.y) * 0.004;
        }
      }
    });
    requestAnimationFrame(draw);
  })();
})();
