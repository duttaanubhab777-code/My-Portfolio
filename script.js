/* ============================================================
   My Portfolio — animation & interaction script (performance build)
   নিয়ম: scroll/mouse হ্যান্ডলার rAF দিয়ে throttled, ভারী অ্যানিমেশন
   (particles) স্ক্রিনের বাইরে গেলে বা ট্যাব লুকালে বন্ধ হয়ে যায়।
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const saveData = navigator.connection && navigator.connection.saveData;

    /* ---------- Preloader ---------- */
    const preloader = $("preloader");
    const loaderPct = $("loaderPct");
    let pct = 0;
    const pctTimer = setInterval(() => {
        pct = Math.min(pct + Math.random() * 14, 97);
        if (loaderPct) loaderPct.textContent = Math.floor(pct) + "%";
    }, 120);
    let loadingDone = false;
    function finishLoading() {
        if (loadingDone) return;
        loadingDone = true;
        clearInterval(pctTimer);
        if (loaderPct) loaderPct.textContent = "100%";
        setTimeout(() => preloader && preloader.classList.add("done"), 400);
        setTimeout(() => preloader && preloader.remove(), 1300);
    }
    window.addEventListener("load", finishLoading);
    setTimeout(finishLoading, 2500);

    /* ---------- Scroll: progress bar + back-to-top (এক handler, rAF throttled) ---------- */
    const progressBar = $("scroll-progress");
    const backToTop = $("backToTop");
    let docH = 0;
    let ticking = false;
    const measure = () => {
        docH = document.documentElement.scrollHeight - window.innerHeight;
    };
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            if (progressBar)
                progressBar.style.transform =
                    "scaleX(" + (docH > 0 ? Math.min(y / docH, 1) : 0) + ")";
            if (backToTop) backToTop.classList.toggle("show", y > 500);
            ticking = false;
        });
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
        measure();
        onScroll();
    });
    window.addEventListener("load", () => {
        measure();
        onScroll();
    });
    if ("ResizeObserver" in window) {
        let roT;
        new ResizeObserver(() => {
            clearTimeout(roT);
            roT = setTimeout(() => {
                measure();
                onScroll();
            }, 200);
        }).observe(document.body);
    }
    onScroll();
    if (backToTop)
        backToTop.addEventListener("click", () =>
            window.scrollTo({ top: 0, behavior: "smooth" })
        );

    /* ---------- Mobile nav toggle ---------- */
    const menuToggle = $("menuToggle");
    const navLinks = $("navLinks");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("open");
            navLinks.classList.toggle("open");
        });
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("open");
                navLinks.classList.remove("open");
            });
        });
    }

    /* ---------- Nav: বর্তমান section হাইলাইট ---------- */
    const navAnchors = [...document.querySelectorAll('#navLinks a[href^="#"]')];
    if (navAnchors.length) {
        const secObs = new IntersectionObserver(
            entries => {
                entries.forEach(en => {
                    if (!en.isIntersecting) return;
                    navAnchors.forEach(a =>
                        a.classList.toggle(
                            "active",
                            a.getAttribute("href") === "#" + en.target.id
                        )
                    );
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        navAnchors.forEach(a => {
            const sec = document.querySelector(a.getAttribute("href"));
            if (sec) secObs.observe(sec);
        });
    }

    /* ---------- Cursor glow (desktop only, rAF throttled) ---------- */
    const cursorGlow = $("cursorGlow");
    if (!isTouch && cursorGlow) {
        let mx = 0,
            my = 0,
            raf = 0;
        window.addEventListener(
            "mousemove",
            e => {
                mx = e.clientX;
                my = e.clientY;
                cursorGlow.classList.add("active");
                if (raf) return;
                raf = requestAnimationFrame(() => {
                    cursorGlow.style.transform =
                        "translate(" +
                        mx +
                        "px," +
                        my +
                        "px) translate(-50%,-50%)";
                    raf = 0;
                });
            },
            { passive: true }
        );
    }

    /* ---------- About: developer.js কোড কার্ড ----------
     লাইনগুলো এই ডাটা থেকে JS বানায়, তাই index.html ফরম্যাট/Prettier করলেও
     কার্ড আর ভাঙবে না। কিছু বদলাতে চাইলে শুধু নিচের ME অবজেক্ট এডিট করো। */
    const ME = {
        role: "Student Developer",
        stack: ["HTML", "CSS", "JavaScript"],
        learning: ["Node.js","Mongoose", "MongoDB"],
        teamsUpWith: "Arnab Adhikari",
        motto: "Learn by building",
        openToCollab: true
    };
    const codeBody = document.querySelector(".cc-body");
    if (codeBody) {
        const tok = (cls, text) => {
            const e = document.createElement("span");
            if (cls) e.className = cls;
            e.textContent = text;
            return e;
        };
        const val = v => {
            const f = document.createDocumentFragment();
            if (Array.isArray(v)) {
                f.append("[");
                v.forEach((x, i) => {
                    if (i) f.append(", ");
                    f.append(tok("s", '"' + x + '"'));
                });
                f.append("]");
            } else if (typeof v === "boolean") f.append(tok("b", String(v)));
            else f.append(tok("s", '"' + v + '"'));
            return f;
        };
        const ln = (ind, i, ...parts) => {
            const l = tok("ln", "");
            l.style.setProperty("--ind", ind);
            l.style.setProperty("--i", i);
            l.append(...parts);
            return l;
        };
        const keys = Object.keys(ME);
        const lines = [
            ln(0, 0, tok("k", "const"), " ", tok("v", "me"), " = {")
        ];
        keys.forEach((k, n) =>
            lines.push(
                ln(
                    1,
                    n + 1,
                    tok("p", k),
                    ": ",
                    val(ME[k]),
                    n === keys.length - 1 ? "" : ","
                )
            )
        );
        lines.push(ln(0, keys.length + 1, "};"));
        codeBody.replaceChildren(...lines);
    }

    /* ---------- Off-screen অ্যানিমেশন pause ----------
     যে section স্ক্রিনে নেই তার infinite অ্যানিমেশন থেমে থাকে (CSS: .anim-gate) */
    const gateObs = new IntersectionObserver(
        entries => {
            entries.forEach(en =>
                en.target.classList.toggle("in-view", en.isIntersecting)
            );
        },
        { rootMargin: "80px 0px" }
    );
    document
        .querySelectorAll("#hero, .marquee, .section-title, .about-divider")
        .forEach(el => {
            el.classList.add("anim-gate");
            gateObs.observe(el);
        });

    /* ---------- Scroll reveal ---------- */
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    document
        .querySelectorAll(".reveal-up, .reveal-left, .reveal-right")
        .forEach(el => revealObserver.observe(el));

    /* ---------- Count-up helper (rAF, ease-out) ---------- */
    function countUp(target, duration, onUpdate) {
        const t0 = performance.now();
        (function step(now) {
            const k = Math.min((now - t0) / duration, 1);
            onUpdate(Math.round(target * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(step);
        })(t0);
    }

    /* ---------- Skill rings ---------- */
    document.querySelectorAll(".ring").forEach(ring => {
        const target =
            parseInt(getComputedStyle(ring).getPropertyValue("--pct")) ||
            parseInt(ring.style.getPropertyValue("--pct")) ||
            0;
        const label = ring.querySelector("span");
        ring.style.setProperty("--pct", 0);
        const ringObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    ringObserver.unobserve(entry.target);
                    countUp(target, 1100, v => {
                        ring.style.setProperty("--pct", v);
                        if (label) label.textContent = v + "%";
                    });
                });
            },
            { threshold: 0.4 }
        );
        ringObserver.observe(ring);
    });

    /* ---------- About stats (PROJECTS ডাটা থেকে অটো হিসাব) ---------- */
    if (typeof PROJECTS !== "undefined") {
        const vals = {
            projects: PROJECTS.length,
            team: PROJECTS.filter(p => p.team).length,
            tech: new Set(PROJECTS.flatMap(p => p.tech)).size
        };
        document.querySelectorAll("[data-stat]").forEach(el => {
            el.dataset.count = vals[el.dataset.stat] || 0;
        });
    }
    const statObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                statObserver.unobserve(entry.target);
                const el = entry.target;
                countUp(parseInt(el.dataset.count) || 0, 1200, v => {
                    el.textContent = v;
                });
            });
        },
        { threshold: 0.6 }
    );
    document
        .querySelectorAll("[data-stat]")
        .forEach(el => statObserver.observe(el));

    /* ---------- Hero word scramble ---------- */
    const scrambleEl = $("scrambleWord");
    if (scrambleEl && !reduceMotion) {
        const finalText = scrambleEl.textContent;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";
        const totalFrames = finalText.length * 3;
        let frame = 0;
        function scrambleFrame() {
            const revealed = Math.floor(
                (frame / totalFrames) * finalText.length
            );
            let out = "";
            for (let i = 0; i < finalText.length; i++) {
                out +=
                    i < revealed
                        ? finalText[i]
                        : chars[Math.floor(Math.random() * chars.length)];
            }
            scrambleEl.textContent = out;
            if (++frame <= totalFrames) requestAnimationFrame(scrambleFrame);
            else scrambleEl.textContent = finalText;
        }
        setTimeout(scrambleFrame, 900);
    }

    /* ---------- Buttons: magnetic (desktop) + ripple ---------- */
    const btns = document.querySelectorAll(".btn-glow, .btn-outline");
    if (!isTouch) {
        btns.forEach(btn => {
            btn.addEventListener("mousemove", e => {
                const r = btn.getBoundingClientRect();
                btn.style.transform =
                    "translate(" +
                    (e.clientX - r.left - r.width / 2) * 0.2 +
                    "px," +
                    (e.clientY - r.top - r.height / 2) * 0.4 +
                    "px)";
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "";
            });
        });
    }
    btns.forEach(btn => {
        btn.addEventListener("click", e => {
            const r = btn.getBoundingClientRect();
            const size = Math.max(r.width, r.height) * 1.6;
            const ripple = document.createElement("span");
            ripple.className = "ripple";
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = e.clientX - r.left - size / 2 + "px";
            ripple.style.top = e.clientY - r.top - size / 2 + "px";
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });

    /* ---------- Project card 3D tilt (desktop only, rAF throttled) ---------- */
    if (!isTouch) {
        document.querySelectorAll(".tilt-card").forEach(card => {
            let raf = 0,
                cx = 0,
                cy = 0;
            card.addEventListener("mousemove", e => {
                cx = e.clientX;
                cy = e.clientY;
                if (raf) return;
                raf = requestAnimationFrame(() => {
                    const r = card.getBoundingClientRect();
                    const rx = ((cy - r.top) / r.height - 0.5) * -8;
                    const ry = ((cx - r.left) / r.width - 0.5) * 8;
                    card.style.transform =
                        "perspective(700px) rotateX(" +
                        rx +
                        "deg) rotateY(" +
                        ry +
                        "deg) translateY(-6px)";
                    raf = 0;
                });
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform =
                    "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
            });
        });
    }

    /* ---------- Particle background (হালকা: 30fps, off-screen হলে বন্ধ) ---------- */
    const canvas = $("particles");
    const hero = $("hero");
    if (canvas && hero && !reduceMotion && !saveData) {
        const ctx = canvas.getContext("2d");
        const N = window.innerWidth < 768 ? 22 : 46;
        const MAX2 = 120 * 120,
            FRAME = 1000 / 30;
        let W = 0,
            H = 0,
            last = 0,
            running = false,
            inView = true;
        const pts = [];

        function size() {
            W = canvas.width = hero.offsetWidth;
            H = canvas.height = hero.offsetHeight;
            pts.forEach(p => {
                p.x = Math.min(p.x, W);
                p.y = Math.min(p.y, H);
            });
        }
        size();
        for (let i = 0; i < N; i++) {
            pts.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.6 + 0.6
            });
        }
        let rt;
        window.addEventListener("resize", () => {
            clearTimeout(rt);
            rt = setTimeout(size, 200);
        });

        function draw() {
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgba(45, 226, 180, 0.7)";
            ctx.beginPath();
            for (const p of pts) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
                ctx.moveTo(p.x + p.r, p.y);
                ctx.arc(p.x, p.y, p.r, 0, 6.2832);
            }
            ctx.fill();
            /* লাইনগুলো ৩টা opacity-বালতিতে ভাগ করে প্রতিটায় একবারই stroke */
            const b = [[], [], []];
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x,
                        dy = pts[i].y - pts[j].y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < MAX2)
                        b[d2 < MAX2 * 0.33 ? 0 : d2 < MAX2 * 0.66 ? 1 : 2].push(
                            pts[i],
                            pts[j]
                        );
                }
            }
            const alpha = [0.15, 0.09, 0.04];
            ctx.lineWidth = 1;
            for (let k = 0; k < 3; k++) {
                if (!b[k].length) continue;
                ctx.strokeStyle = "rgba(45, 226, 180, " + alpha[k] + ")";
                ctx.beginPath();
                for (let m = 0; m < b[k].length; m += 2) {
                    ctx.moveTo(b[k][m].x, b[k][m].y);
                    ctx.lineTo(b[k][m + 1].x, b[k][m + 1].y);
                }
                ctx.stroke();
            }
        }
        function tick(t) {
            if (!running) return;
            requestAnimationFrame(tick);
            if (t - last < FRAME) return;
            last = t;
            draw();
        }
        function sync() {
            const should = inView && !document.hidden;
            if (should && !running) {
                running = true;
                requestAnimationFrame(tick);
            } else if (!should) running = false;
        }
        new IntersectionObserver(en => {
            inView = en[0].isIntersecting;
            sync();
        }).observe(hero);
        document.addEventListener("visibilitychange", sync);
        sync();
    }
});
