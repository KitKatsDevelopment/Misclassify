/* ============================================================
   Misclassify — portfolio data + rendering
   Edit the CONFIG block and the two arrays below to update the site.
   ============================================================ */

/* ── EDIT ME ─────────────────────────────────────────────── */
const CONFIG = {
  name:    "Misclassify",
  discord: "misclassify",     // your Discord username (no @)
  discordUrl: "https://discord.com/users/787525664809943071" // your Discord profile link
};

/* ── Staff experience (sorted oldest → newest automatically) ─
   sort  : ISO date used only for ordering / stats
   dates : text shown on the card
   current: true renders the live badge
   ----------------------------------------------------------- */
const EXPERIENCE = [
  { server: "MineWild",        role: "Helper",    sort: "2023-03-07", dates: "Mar 7, 2023 — Apr 2, 2023" },
  { server: "Owners United",   role: "OU Staff",  sort: "2023-04-10", dates: "Apr 10, 2023 — May 28, 2023" },
  { server: "MangoMC",         role: "Helper",    sort: "2023-05-29", dates: "May 29, 2023 — Jun 1, 2023" },
  { server: "SkyLimit",        role: "Mod",       sort: "2023-06-01", dates: "Jun 1, 2023 — Jun 26, 2023" },
  { server: "Platypus World",  role: "Staff",     sort: "2023-06-27", dates: "Jun 27, 2023 —" },
  { server: "Platypus World",  role: "Staff",     sort: "2023-06-28", dates: "2023 —" },
  { server: "Stars World",     role: "Staff",     sort: "2023-12-11", dates: "Dec 11, 2023 — Aug 7, 2024" },
  { server: "GhostieSMP",      role: "Staff",     sort: "2024-03-31", dates: "Mar 31, 2024 — Present", current: true },
  { server: "The Backstreets", role: "Staff",     sort: "2024-06-30", dates: "Jun 30, 2024 — Present", current: true }
];

/* ── Vouches ──────────────────────────────────────────────── */
const VOUCHES = [
  {
    name: "Scrainyr",
    role: "UniversalMC",
    quote: "Vouch."
  },
  {
    name: "Melly",
    role: "Freelance artist",
    quote: "vouch"
  },
  {
    name: "Daniel",
    role: "Known him for 3 years",
    quote: "vouch i have unfortunately known him for 3 years"
  },
  {
    name: "pxtf",
    role: "Community member",
    quote: "INSANE VOUCH"
  },
  {
    name: "Cosmic Risk",
    role: "Community member",
    quote: "I love the work Misclassify does. He has helped me set up numerous things when it has come to discord things, and I also love his attitude. Misclassify is a really active user, who gets the job done. He has helped and supported me many times and I really appreciate him. Thanks, bud <3"
  },
  {
    name: "Amber",
    role: "OA Staff",
    quote: "Uh they are awesome and uh nice to me and uh kinda maybe slightly a femboy and uh more nice to me. They are a great staff member i hope. you should hire them!"
  },
  {
    name: "DaisyLGBT",
    role: "Founder of Sapphire — retired staff",
    quote: "one of the coolest FEMBOYS of OA, you can't go wrong talking to this FEMBOY with TWINK ENERGY this FEMBOY goes to extreme measures and will satisfy you and your business as long as you give this FEMBOY head pats"
  },
  {
    name: "Ch3rry",
    role: "Community member",
    quote: "Goated person ever, helping me set up a tebex because i fuh up somewhere so thanks to misclassify dont know where i would be without her/him thanks goat"
  }
];

/* ── Vouch screenshots ─────────────────────────────────────
   Add a screenshot per person in the Vouches/ folder, named after
   them (e.g. Vouches/Scrainyr.png). Clicking a vouch quote reveals
   that person's screenshot. No code changes needed to add images.
   ----------------------------------------------------------- */
const VOUCH_DIR  = "Vouches/";
const VOUCH_EXTS = ["png", "jpg", "jpeg", "webp", "gif"];

/* ============================================================
   Rendering — no need to edit below this line
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

function sortedExperience() {
  return EXPERIENCE.slice().sort((a, b) => a.sort.localeCompare(b.sort));
}

function renderStats() {
  const list = sortedExperience();

  const stats = [
    { label: "Communities",   value: list.length },
    { label: "Current roles", value: list.filter((r) => r.current).length },
    { label: "Vouches",       value: VOUCHES.length }
  ];

  $("#stats").innerHTML = stats.map((s) => `
    <div class="stat">
      <dt>${s.label}</dt>
      <dd>${s.value}</dd>
    </div>
  `).join("");
}

function renderTimeline() {
  $("#timeline").innerHTML = sortedExperience().map((item) => `
    <li class="${item.current ? "is-current" : ""} reveal">
      <div class="entry">
        <h3 class="entry-server">${item.server}</h3>
        <span class="entry-role">${item.role}</span>
        <span class="entry-dates">
          ${item.dates}
          ${item.current ? '<span class="badge-live">Active</span>' : ''}
        </span>
      </div>
    </li>
  `).join("");
}

/* ── Vouches — a row of equal cards, arrows to page ───────── */

let vouchIndex = 0;

/* How many cards fit the row: 3 desktop, 2 tablet, 1 phone. */
function visibleVouches() {
  if (window.matchMedia("(min-width: 980px)").matches) return 3;
  if (window.matchMedia("(min-width: 660px)").matches) return 2;
  return 1;
}

function lastVouchIndex() {
  return Math.max(0, VOUCHES.length - visibleVouches());
}

function renderVouches() {
  $("#vouch-prev").addEventListener("click", () => stepVouch(-1));
  $("#vouch-next").addEventListener("click", () => stepVouch(1));

  // arrow keys while an arrow button has focus
  ["#vouch-prev", "#vouch-next"].forEach((sel) => {
    $(sel).addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); stepVouch(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); stepVouch(1); }
    });
  });

  // keep the row valid when the breakpoint changes
  let lastCount = visibleVouches();
  window.addEventListener("resize", () => {
    const count = visibleVouches();
    if (count === lastCount) return;
    lastCount = count;
    vouchIndex = Math.min(vouchIndex, lastVouchIndex());
    paintVouches();
  });

  paintVouches();
}

function stepVouch(delta) {
  const span = lastVouchIndex() + 1;
  vouchIndex = (vouchIndex + delta + span) % span;
  paintVouches();
}

function paintVouches() {
  const shown = VOUCHES.slice(vouchIndex, vouchIndex + visibleVouches());
  const stage = $("#vouch-stage");

  stage.innerHTML = shown.map((v) => `
    <article class="vouch vouch-card">
      <button
        class="vouch-quote"
        type="button"
        aria-expanded="false"
        aria-label="Show the screenshot of ${v.name}'s vouch"
      >&ldquo;${v.quote}&rdquo;</button>
      <div class="vouch-person">
        <span>
          <span class="person-name">${v.name}</span><br />
          <span class="person-role">${v.role}</span>
        </span>
      </div>
      <figure class="vouch-shot" hidden></figure>
    </article>
  `).join("");

  // Screenshots load the first time a quote is opened.
  stage.querySelectorAll(".vouch").forEach((card, i) => {
    const v = shown[i];
    const quote = card.querySelector(".vouch-quote");
    const shot = card.querySelector(".vouch-shot");

    quote.addEventListener("click", () => {
      const open = quote.getAttribute("aria-expanded") === "true";
      quote.setAttribute("aria-expanded", String(!open));
      quote.setAttribute(
        "aria-label",
        `${open ? "Show" : "Hide"} the screenshot of ${v.name}'s vouch`
      );
      shot.hidden = open;

      if (!open && !shot.dataset.loaded) {
        shot.dataset.loaded = "1";
        shot.innerHTML = '<span class="vouch-shot-note">Loading screenshot&hellip;</span>';
        loadVouchShot(v.name, shot);
      }
    });
  });
}

function loadVouchShot(name, shot) {
  const base = `${VOUCH_DIR}${encodeURIComponent(name)}`;
  const sources = VOUCH_EXTS.map((ext) => `${base}.${ext}`);

  const tryAt = (index) => {
    if (index >= sources.length) {
      shot.innerHTML = '<span class="vouch-shot-note">' +
        `No screenshot yet &mdash; add <code>${VOUCH_DIR}${name}.png</code>` +
        '</span>';
      return;
    }

    const img = new Image();
    img.className = "vouch-shot-img";
    img.alt = `Screenshot of ${name}'s vouch`;
    img.decoding = "async";
    img.onload = () => {
      shot.innerHTML = "";
      shot.appendChild(img);
    };
    img.onerror = () => tryAt(index + 1);
    img.src = sources[index];
  };

  tryAt(0);
}

function renderContact() {
  const label = "@" + CONFIG.discord;
  $("#handle-line").textContent = `Discord: ${label}`;
  $("#discord-link").href = CONFIG.discordUrl;

  const btn = $("#copy-discord");
  const btnLabel = $("#copy-label");

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.discord);
      btnLabel.textContent = "Copied!";
    } catch {
      btnLabel.textContent = label;
    }
    setTimeout(() => { btnLabel.textContent = "Copy Discord"; }, 1800);
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  items.forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 40, 240) + "ms";
    io.observe(el);
  });
}

function setupNav() {
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function init() {
  renderStats();
  renderTimeline();
  renderVouches();
  renderContact();
  setupNav();
  setupReveal();
  $("#year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
