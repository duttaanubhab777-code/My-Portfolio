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
        color: "#00ff88",
        github: "https://github.com/duttaanubhab777-code"
    },
    arnab: {
        name: "Arnab Adhikari",
        icon: "fa-user-ninja",
        color: "#ff2b6e",
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
            "APIs"
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
        desc: `Live Weather App is a clean, responsive web application designed to provide users with real-time weather updates and accurate forecasts.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Frontend Interface:</b> Designed an intuitive and visually appealing user interface utilizing HTML5 and CSS3, ensuring a fully responsive layout across mobile and desktop devices.</li>
  <li><b>Dynamic Data Integration:</b> Developed the core application logic using Vanilla JavaScript to efficiently fetch, process, and display live weather data from external APIs.</li>
  <li><b>Solo Development:</b> Independently managed the entire project lifecycle from UI design to logic implementation, demonstrating strong foundational frontend development skills.</li>
  <li><b>Deployment & Version Control:</b> Maintained clean, structured source code on GitHub and successfully deployed the fast-loading static web application via GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/Live-Weather-App/",
        code: "https://github.com/duttaanubhab777-code/Live-Weather-App/tree/main"
    },
    {
        title: "Calculator",
        image: "image/calculator.jpg",
        desc: `A sleek and responsive web-based calculator application built to perform fundamental arithmetic operations accurately.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Frontend Interface:</b> Designed a clean, user-friendly, and responsive interface using HTML5 and CSS3, ensuring a smooth visual experience across devices.</li>
  <li><b>Core Logic & Functionality:</b> Implemented dynamic calculation logic utilizing Vanilla JavaScript to handle user inputs, mathematical operations, and real-time display updates.</li>
  <li><b>Solo Development:</b> Independently built the entire application from scratch, demonstrating strong problem-solving skills and a solid understanding of DOM manipulation.</li>
  <li><b>Deployment & Version Control:</b> Maintained version-controlled source code on GitHub and successfully deployed the interactive static application via GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JS"],
        demo: "https://duttaanubhab777-code.github.io/Calculator/",
        code: "https://github.com/duttaanubhab777-code/Calculator/tree/main"
    },
    {
        title: "Tic-Tac-Toe",
        image: "image/Tic-Tac-Toe.jpg",
        desc: `A feature-rich, installable Tic-Tac-Toe web application offering advanced AI opponents, dynamic gameplay modes, and offline capabilities.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Advanced Game Logic & AI:</b> Engineered complex state management in Vanilla JavaScript, featuring a custom series mode, live scoreboards, and a 5-level computer AI that utilizes the Minimax algorithm for an unbeatable 'Genius' difficulty.</li>
  <li><b>Progressive Web App (PWA):</b> Transformed the web game into a fully installable, mobile-ready application with full offline support by implementing Service Workers (sw.js) and a Web App Manifest.</li>
  <li><b>Interactive UX & Animations:</b> Designed a highly engaging UI using HTML5 and CSS3, integrating system-aware dark/light themes, sound effects, device vibration, and smooth CSS animations (like confetti and win-lines).</li>
  <li><b>Solo Development & Deployment:</b> Built the complete application independently without relying on external build tools or frameworks, maintaining structured code on GitHub and hosting seamlessly on GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/Tic-Tac-Toe/",
        code: "https://github.com/duttaanubhab777-code/Tic-Tac-Toe/tree/main"
    },
    {
        title: "QR Code Generator",
        image: "image/QRgenerator.jpg",
        desc: `A fast and interactive web application that instantly generates scannable QR codes from user-provided text or URLs.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Frontend Interface:</b> Designed a clean, intuitive, and fully responsive UI using HTML5 and CSS3, providing a seamless experience across all devices.</li>
  <li><b>Dynamic Generation:</b> Implemented Vanilla JavaScript to capture real-time user input and dynamically render QR codes, showcasing strong DOM manipulation and event handling skills.</li>
  <li><b>Solo Development:</b> Independently planned and developed the application from scratch, creating a highly practical and lightweight utility tool.</li>
  <li><b>Deployment & Version Control:</b> Maintained organized source code on GitHub and successfully deployed the production-ready static app via GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/QR-Code-Generator/",
        code: "https://github.com/duttaanubhab777-code/QR-Code-Generator/tree/main"
    },
    {
        title: "Result Analysis",
        image: "image/Result.jpg",
        desc: `An advanced, web-based result analysis application specifically designed to calculate grades, evaluate academic performance, and generate automated reports.<br><br>
<ul style="margin-left: 20px; list-style-type: disc;">
  <li><b>Frontend Interface:</b> Designed a clean, interactive data-entry dashboard using HTML5 and CSS3, ensuring seamless usability across all devices.</li>
  <li><b>Core Logic & Processing:</b> Engineered complex calculation logic using Vanilla JavaScript to accurately process academic scores, percentages, and grade points tailored for higher-secondary science standards.</li>
  <li><b>Automated PDF Export:</b> Implemented dynamic document generation features allowing users to instantly compile and download their calculated academic results as polished PDF reports.</li>
  <li><b>Solo Development & Deployment:</b> Independently developed the entire application from scratch, successfully deploying the optimized, production-ready static site via GitHub Pages.</li>
</ul>`,
        tech: ["HTML", "CSS", "JavaScript"],
        demo: "https://duttaanubhab777-code.github.io/Result-Analysis/",
        code: "https://github.com/duttaanubhab777-code/Result-Analysis/tree/main"
    }
];

/* =====================================================
   Render — এই নিচের অংশ সাধারণত বদলানো লাগবে না
   ===================================================== */

/* একটা প্রজেক্ট থেকে একটা card এর HTML বানায় */
function cardHTML(p, i) {
    const ribbon = p.team
        ? `<span class="featured-ribbon">TEAM PROJECT</span>`
        : "";

    const creators = p.team
        ? `
          <div class="creators-box">
            <p class="creators-title"><i class="fa-solid fa-laptop-code"></i> Creators :</p>
            ${p.team
                .map(m => {
                    const c = PEOPLE[m.who];
                    return `<div class="creator-row">
              <div class="creator-who">
                <span class="creator-name"><i class="fa-solid ${c.icon}" style="color: ${c.color};"></i> ${c.name}</span>
                <span class="role-tag ${m.type}">${m.role}</span>
              </div>
              <a href="${c.github}" target="_blank" class="github-link"><i class="fa-brands fa-github"></i> GitHub</a>
            </div>`;
                })
                .join("")}
          </div>`
        : "";

    const delay = (0.05 + i * 0.05).toFixed(2);

    return `
      <div class="project-card reveal-up tilt-card" style="--delay:${delay}s">
        ${ribbon}
        <div class="project-image"><img src="${p.image}" alt="${p.title}"></div>
        <div class="project-info">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          ${creators}
          <div class="tech-stack">${p.tech.map(t => `<span>${t}</span>`).join("")}</div>
          <div class="project-links">
            <a href="${p.demo}"><i class="fa-solid fa-link"></i> Live Demo</a>
            <a href="${p.code}"><i class="fa-brands fa-github"></i> Code</a>
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
