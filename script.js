/* ============================================================
   My Portfolio — animation & interaction script
   Sections: Preloader, Scroll progress, Nav menu, Cursor glow,
   Blob parallax, Particle background, Scroll reveals, Skill rings,
   Scramble text, Card tilt, Back-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader (with live % counter) ---------- */
  const preloader = document.getElementById('preloader');
  const loaderPct = document.getElementById('loaderPct');
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 14, 97);
    if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
  }, 120);

  function finishLoading() {
    clearInterval(pctTimer);
    if (loaderPct) loaderPct.textContent = '100%';
    setTimeout(() => preloader && preloader.classList.add('done'), 400);
  }
  window.addEventListener('load', finishLoading);
  // Fallback in case 'load' already fired or takes too long
  setTimeout(finishLoading, 2500);

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pctVal = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pctVal + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Mobile nav toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Cursor glow + blob parallax (desktop only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const isTouch = window.matchMedia('(hover: none)').matches;
  const blobA = document.getElementById('blobA');
  const blobB = document.getElementById('blobB');
  const blobC = document.getElementById('blobC');

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      if (cursorGlow) {
        cursorGlow.classList.add('active');
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      // ব্যাকগ্রাউন্ড ব্লবগুলো মাউসের সাথে হালকা প্যারালাক্স মুভমেন্ট করবে
      const xPct = (e.clientX / window.innerWidth - 0.5);
      const yPct = (e.clientY / window.innerHeight - 0.5);
      if (blobA) blobA.style.transform = `translate(${xPct * -30}px, ${yPct * -30}px)`;
      if (blobB) blobB.style.transform = `translate(${xPct * 25}px, ${yPct * 25}px)`;
      if (blobC) blobC.style.transform = `translate(${xPct * -20}px, ${yPct * 20}px)`;
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Skill ring grow-on-view (fill + number count-up together) ---------- */
  const rings = document.querySelectorAll('.ring');
  rings.forEach(ring => {
    const target = parseInt(getComputedStyle(ring).getPropertyValue('--pct')) ||
                    parseInt(ring.style.getPropertyValue('--pct')) || 0;
    const label = ring.querySelector('span');
    ring.style.setProperty('--pct', 0);
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let current = 0;
          const step = Math.max(1, Math.round(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            ring.style.setProperty('--pct', current);
            if (label) label.textContent = current + '%';
          }, 20);
          ringObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    ringObserver.observe(ring);
  });

  /* ---------- Hero word scramble-in effect ---------- */
  const scrambleEl = document.getElementById('scrambleWord');
  if (scrambleEl) {
    const finalText = scrambleEl.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';
    let frame = 0;
    const totalFrames = finalText.length * 3;

    function scrambleFrame() {
      let output = '';
      const revealedCount = Math.floor((frame / totalFrames) * finalText.length);
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealedCount) {
          output += finalText[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      scrambleEl.textContent = output;
      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(scrambleFrame);
      } else {
        scrambleEl.textContent = finalText;
      }
    }
    setTimeout(scrambleFrame, 900);
  }

  /* ---------- Magnetic buttons (desktop only) ---------- */
  if (!isTouch) {
    document.querySelectorAll('.btn-glow, .btn-outline').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.4}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Ripple click effect on buttons ---------- */
  document.querySelectorAll('.btn-glow, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Project card 3D tilt (desktop only) ---------- */
  if (!isTouch) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Particle background (hero canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const heroSection = document.getElementById('hero');

    function resize() {
      width = canvas.width = heroSection.offsetWidth;
      height = canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 768 ? 35 : 70;
    function initParticles() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6
        });
      }
    }
    initParticles();

    const maxDist = 140;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.12 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      animate();
    }
  }

});