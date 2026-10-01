/* =====================================================
   projects.js — সব প্রজেক্টের ডেটা এখানে
   নতুন প্রজেক্ট যোগ করতে নিচের PROJECTS array তে একটা { ... } block বসাও।
   HTML বদলানোর দরকার নেই।

   - "team" আছে  => Collaboration Projects section এ যাবে
   - "team" নেই  => My Projects section এ যাবে
   ===================================================== */

/* ---------- লোকের তথ্য (একবারই লেখা, প্রজেক্টে শুধু key দিলেই হবে) ---------- */
const PEOPLE = {
    anubhab: {
        name: "Anubhab Dutta",
        icon: "fa-user-astronaut",
        color: "#2de2b4",
        github: "https://github.com/duttaanubhab777-code"
    },
    arnab: {
        name: "Arnab Adhikari",
        icon: "fa-user-ninja",
        color: "#ff9f7a",
        github: "https://arnabadhikari777.github.io/My-Portfolio./"
    }
};

/* ---------- প্রজেক্ট লিস্ট ---------- */
const PROJECTS = [
    /* ===== Collaboration (team আছে) ===== */
    {
        title: "Friendly Flux",
        image: "image/friendly-flux.jpg",
        desc: `Friendly Flux is an advanced, full-stack STEM problem-solving platform designed to solve Mathematics, Physics, and Chemistry problems step-by-step.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Backend & AI Integration:</b> Built a robust API using Python, Flask, SymPy, and NumPy, featuring seven independent solver engines and a Google Gemini-powered Math OCR for reading handwritten expressions.</li>
  <li><b>Frontend Interface:</b> Developed a lightweight, mobile-first, and bilingual UI (English & Bengali) using HTML5, CSS3, and JavaScript, integrating Plotly and Chart.js for 2D/3D interactive graphing.</li>
  <li><b>Advanced Problem Solving:</b> Implemented a hybrid forward-chaining and simultaneous solver for Physics and Chemistry (over 400 formulas) alongside comprehensive Calculus, Algebra, and 3D Geometry engines.</li>
  <li><b>Deployment & Security:</b> Maintained collaborative code via GitHub, deploying the frontend on GitHub Pages and backend on PythonAnywhere, ensuring secure computation with strict timeouts and input validation</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript", "Python", "Flask", "APIs"],
        demo: "https://duttaanubhab777-code.github.io/Friendly-Flux/frontend/",
        code: "https://github.com/duttaanubhab777-code/Friendly-Flux/tree/main",
        team: [
            { who: "anubhab", role: "Frontend", type: "frontend" },
            { who: "arnab", role: "Backend", type: "backend" }
        ]
    },
    {
        title: "Beyonder Ai",
        image: "image/beyonder.jpg",
        desc: `Beyonder AI 2.0 is an advanced, full-stack conversational AI web interface designed to deliver seamless and intelligent user interactions.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>AI Integration & Backend:</b> Developed the robust backend using Python and Flask, seamlessly integrating large language model APIs (like Gemini/Groq) to process user queries in real time.</li>
  <li><b>Database Management:</b> Implemented an SQLite database to efficiently manage user sessions, store chat histories, and retrieve previous conversations securely.</li>
  <li><b>Frontend Interface:</b> Designed a highly interactive and responsive UI using HTML5, CSS3, and JavaScript, featuring smooth transitions and dynamic rendering via Jinja2 templating.</li>
  <li><b>Deployment & Version Control:</b> Maintained collaborative and version-controlled code on GitHub and deployed the dynamic web application via GitHub Pages (or backend proxy hosting).</li>
</ul>`,
        tech: [
            "HTML",
            "CSS",
            "JavaScript",
            "Jinja 2",
            "Python",
            "Flask",
            "SQL Lite",
            "APIs",
            "PWA"
        ],
        demo: "https://duttaanubhab777-code.github.io/Beyonder-Ai-2.0/",
        code: "https://github.com/duttaanubhab777-code/Beyonder-Ai-2.0/tree/main",
        team: [
            { who: "anubhab", role: "Frontend", type: "frontend" },
            { who: "arnab", role: "Backend &amp; Database", type: "backend" }
        ]
    },

    {
        title: "AA News",
        image: "image/news.jpg",
        desc: `AA News is a dynamic, full-stack news aggregator platform built to deliver categorized, real-time news with a smooth user experience.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Backend & Templating:</b> Developed the core server logic using Python and the Flask framework, utilizing Jinja2 templating to render dynamic HTML pages efficiently.</li>
  <li><b>Database Management:</b> Integrated an SQLite database to manage user data, saved preferences, or article caching securely and efficiently.</li>
  <li><b>Frontend Interface:</b> Designed a responsive, interactive UI utilizing HTML5, CSS3, and JavaScript, ensuring a seamless experience across desktop and mobile devices.</li>
  <li><b>Deployment & Version Control:</b> Maintained collaborative code management via GitHub and successfully deployed the production-ready application on PythonAnywhere.</li>
</ul>`,
        tech: [
            "HTML",
            "CSS",
            "JavaScript",
            "Jinja 2",
            "Python",
            "Flask",
            "SQL Lite",
            "APIs"
        ],
        demo: "https://arnabadhikari125117y.pythonanywhere.com/",
        code: "https://github.com/arnabadhikari777/AA_News/tree/main",
        team: [
            { who: "anubhab", role: "Frontend", type: "frontend" },
            { who: "arnab", role: "Backend &amp; Database", type: "backend" }
        ]
    },

    /* ===== My Projects (team নেই) ===== */
    {
        title: "Weather App",
        image: "image/weather.jpg",
        desc: `A clean, fast weather app that shows live conditions and forecasts the moment you ask for them.<br><br>
<ul>
  <li><b>Live Data Engine:</b> Fetches real-time weather from an external API with async JavaScript and presents it instantly and clearly.</li>
  <li><b>Clean, Responsive UI:</b> A mobile-first layout in HTML5 and CSS3 that stays sharp and easy to read on every screen size.</li>
  <li><b>Built Solo:</b> Designed, coded and debugged end to end on my own, from first sketch to final polish.</li>
  <li><b>Deployment &amp; Version Control:</b> Source managed on GitHub and hosted on GitHub Pages for fast, free loading.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/Live-Weather-App/",
        code: "https://github.com/duttaanubhab777-code/Live-Weather-App/tree/main"
    },
    {
        title: "Calculator",
        image: "image/calculator.jpg",
        desc: `A sleek, responsive calculator that handles everyday arithmetic accurately with a smooth real-time display.<br><br>
<ul>
  <li><b>Clean Interface:</b> A tap-friendly HTML5 and CSS3 layout that feels natural on both phone and desktop.</li>
  <li><b>Core Logic:</b> Vanilla JavaScript manages input, operator order and live display updates with zero libraries.</li>
  <li><b>Built Solo:</b> Written from scratch as a hands-on deep dive into DOM manipulation and event handling.</li>
  <li><b>Deployment &amp; Version Control:</b> Versioned on GitHub and live on GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JS"],
        demo: "https://duttaanubhab777-code.github.io/Calculator/",
        code: "https://github.com/duttaanubhab777-code/Calculator/tree/main"
    },
    {
        title: "Tic-Tac-Toe",
        image: "image/Tic-Tac-Toe.jpg",
        desc: `An installable, offline-ready Tic-Tac-Toe game with five AI levels, series mode and live scoreboards.<br><br>
<ul>
  <li><b>Smart AI:</b> Five computer difficulty levels, topped by an unbeatable 'Genius' mode powered by the Minimax algorithm.</li>
  <li><b>Installable PWA:</b> A service worker and web manifest make it installable on your phone and playable fully offline.</li>
  <li><b>Polished UX &amp; Animations:</b> Dark and light themes, sound effects, vibration feedback and CSS animations like confetti and win-lines.</li>
  <li><b>Solo Development &amp; Deployment:</b> Pure vanilla JavaScript with no frameworks or build tools, hosted on GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript", "PWA"],
        demo: "https://duttaanubhab777-code.github.io/Tic-Tac-Toe/",
        code: "https://github.com/duttaanubhab777-code/Tic-Tac-Toe/tree/main"
    },
    {
        title: "QR Code Generator",
        image: "image/QRgenerator.jpg",
        desc: `A lightweight utility that turns any text or link into a scannable QR code the instant you type.<br><br>
<ul>
  <li><b>Instant Generation:</b> JavaScript reads live input and renders the QR code on the fly, no page reload needed.</li>
  <li><b>Clean Interface:</b> A minimal, responsive HTML5 and CSS3 UI focused on doing one job really well.</li>
  <li><b>Built Solo:</b> Planned and built from scratch, sharpening my event-handling and DOM skills.</li>
  <li><b>Deployment &amp; Version Control:</b> Organised source on GitHub, deployed on GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/QR-Code-Generator/",
        code: "https://github.com/duttaanubhab777-code/QR-Code-Generator/tree/main"
    },
    {
        title: "Result Analysis",
        image: "image/Result.jpg",
        desc: `A results calculator for higher-secondary science students that turns raw marks into grades, percentages and a downloadable report.<br><br>
<ul>
  <li><b>Smart Calculations:</b> JavaScript processes scores, percentages and grade points following higher-secondary science standards.</li>
  <li><b>Data-Entry Dashboard:</b> An interactive, easy-to-fill layout that works smoothly across all devices.</li>
  <li><b>One-Tap PDF Report:</b> Generates a polished PDF of the calculated result that can be downloaded instantly.</li>
  <li><b>Solo Development &amp; Deployment:</b> Built from scratch and deployed as an optimised static site on GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/Result-Analysis/",
        code: "https://github.com/duttaanubhab777-code/Result-Analysis/tree/main"
    }
];

/* =====================================================
   Render — এই নিচের অংশ সাধারণত বদলানো লাগবে না
   desc এর ভেতরের intro লাইন + <li><b>Title:</b> text</li> গুলো
   অটোমেটিক সুন্দর feature card এ রূপান্তরিত হয়।
   ===================================================== */

/* বুলেটের title দেখে উপযুক্ত আইকন বেছে নেয় */
const ICON_RULES = [
    [/\bAI\b/i, "fa-robot"],
    [/database/i, "fa-database"],
    [/backend|server|templating/i, "fa-server"],
    [/pwa|progressive/i, "fa-mobile-screen"],
    [/pdf|export/i, "fa-file-pdf"],
    [/solo/i, "fa-user-astronaut"],
    [/deploy/i, "fa-rocket"],
    [/frontend|interface|ux|dashboard/i, "fa-wand-magic-sparkles"],
    [/logic|engine|calculation|generation|integration|problem/i, "fa-gears"]
];
const pickIcon = t =>
    (ICON_RULES.find(([re]) => re.test(t)) || [0, "fa-circle-check"])[1];

/* desc HTML থেকে intro আর bullet আলাদা করে */
function parseDesc(html) {
    const box = document.createElement("div");
    box.innerHTML = html;
    const lead = (box.childNodes[0].textContent || "").trim();
    const items = [...box.querySelectorAll("li")].map(li => {
        const b = li.querySelector("b");
        const title = b ? b.textContent.replace(/:\s*$/, "") : "";
        if (b) b.remove();
        return { title, text: li.textContent.trim() };
    });
    return { lead, items };
}

/* কার্ডে হালকা thumb (image/thumb/*.webp), ফুল ছবি শুধু lightbox এ লোড হয় */
const thumbOf = s => s.replace(/^image\/([^/]+)\.\w+$/, "image/thumb/$1.webp");

function cardHTML(p, i) {
    const { lead, items } = parseDesc(p.desc);
    const isTeam = !!p.team;
    const ribbon = isTeam
        ? `<span class="featured-ribbon">TEAM PROJECT</span>`
        : "";
    const kind = isTeam
        ? ""
        : `<span class="kind"><i class="fa-solid fa-bolt"></i> SOLO BUILD</span>`;

    const creators = isTeam
        ? `<div class="creators-box">
            <p class="creators-title"><i class="fa-solid fa-laptop-code"></i> Creators :</p>
            ${p.team
                .map(m => {
                    const c = PEOPLE[m.who];
                    return `<div class="creator-row">
              <div class="creator-who">
                <span class="creator-name"><i class="fa-solid ${c.icon}" style="color: ${c.color};"></i> ${c.name}</span>
                <span class="role-tag ${m.type}">${m.role}</span>
              </div>
              <a href="${c.github}" target="_blank" rel="noopener" class="github-link"><i class="fa-brands fa-github"></i> GitHub</a>
            </div>`;
                })
                .join("")}
          </div>`
        : "";

    const feats = items
        .map(
            (it, n) => `<li style="--i:${n}">
              <span class="feat-ico"><i class="fa-solid ${pickIcon(it.title)}"></i></span>
              <div><b>${it.title}</b><span class="ft">${it.text}</span></div>
            </li>`
        )
        .join("");

    const delay = (0.05 + i * 0.05).toFixed(2);
    const num = String(i + 1).padStart(2, "0");

    return `
      <div class="project-card reveal-up tilt-card ${isTeam ? "team" : "solo"}" style="--delay:${delay}s">
        ${ribbon}
        <div class="project-image">
          <div class="stage-bg"></div>
          <span class="idx">${num}</span>
          <div class="phone" data-full="${p.image}" data-title="${p.title}">
            <img src="${thumbOf(p.image)}" alt="${p.title} screenshot" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${p.image}'">
          </div>
          <button class="zoom-chip" type="button" aria-label="View ${p.title} screenshot full size"><i class="fa-solid fa-expand"></i> View full</button>
        </div>
        <div class="project-info">
          <div class="pi-head"><h3>${p.title}</h3>${kind}</div>
          <p class="lead">${lead}</p>
          ${creators}
          <div class="tech-stack">${p.tech.map(t => `<span>${t}</span>`).join("")}</div>
          <button class="more-btn" type="button" aria-expanded="false"><span>Read more</span> <i class="fa-solid fa-chevron-down"></i></button>
          <div class="details"><div class="details-inner"><ul class="feat-list">${feats}</ul></div></div>
          <div class="project-links">
            <a href="${p.demo}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
            <a href="${p.code}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>
          </div>
        </div>
      </div>`;
}

/* দুই section এর container এ card বসায় */
const collabGrid = document.getElementById("collab-grid");
const projectsGrid = document.getElementById("projects-grid");

if (collabGrid) {
    collabGrid.innerHTML = PROJECTS.filter(p => p.team)
        .map(cardHTML)
        .join("");
}
if (projectsGrid) {
    projectsGrid.innerHTML = PROJECTS.filter(p => !p.team)
        .map(cardHTML)
        .join("");
}

/* ---------- Read more toggle + Lightbox (event delegation) ---------- */
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `<button class="lb-close" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><img alt=""><p class="lb-cap"></p>`;
document.body.appendChild(lightbox);

function openLightbox(src, title) {
    lightbox.querySelector("img").src = src;
    lightbox.querySelector(".lb-cap").textContent = title;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
}
function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
}
lightbox.addEventListener("click", closeLightbox);
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
});

document.addEventListener("click", e => {
    const more = e.target.closest(".more-btn");
    if (more) {
        const card = more.closest(".project-card");
        const open = card.classList.toggle("open");
        more.setAttribute("aria-expanded", open);
        more.querySelector("span").textContent = open
            ? "Show less"
            : "Read more";
        return;
    }
    const view = e.target.closest(".phone, .zoom-chip");
    if (view) {
        const phone = view.closest(".project-card").querySelector(".phone");
        openLightbox(phone.dataset.full, phone.dataset.title);
    }
});

/* mouse spotlight — শুধু মাউস আছে এমন ডিভাইসে, rAF দিয়ে throttled */
if (matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".project-card").forEach(card => {
        let raf = 0,
            x = 0,
            y = 0;
        card.addEventListener("pointermove", e => {
            x = e.clientX;
            y = e.clientY;
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const r = card.getBoundingClientRect();
                card.style.setProperty("--mx", x - r.left + "px");
                card.style.setProperty("--my", y - r.top + "px");
                raf = 0;
            });
        });
    });
}
