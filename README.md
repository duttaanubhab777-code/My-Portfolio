# My Portfolio

A personal **full-stack developer** portfolio. The site itself is built with plain **HTML, CSS & JavaScript** — no frameworks, no build step — and it showcases projects across React, Node.js/Express, MongoDB and Flask. Dark, cyberpunk-inspired UI with a green neon accent, animated hero background, scroll-triggered reveals, and interactive project cards.

**Live site:** https://duttaanubhab777-code.github.io/My-Portfolio/

---

## ✨ Features

- **Animated preloader** with a typing-style flicker effect
- **Particle network background** in the hero section (pure Canvas, no libraries)
- **Scroll-triggered reveal animations** for every section (IntersectionObserver)
- **Custom cursor glow** that follows the pointer on desktop
- **Animated skill rings** (conic-gradient progress circles that fill in on scroll)
- **3D tilt effect** on project cards that follows the mouse
- **Scroll progress bar** pinned to the top of the page
- **Responsive mobile navigation** with an animated hamburger menu
- **Back-to-top button** that appears after scrolling
- Fully responsive — looks good from a small phone screen up to desktop
- Respects `prefers-reduced-motion` for accessibility

## 🗂️ Project Structure

```
My-Portfolio/
├── index.html      # Home page — hero, skills, projects, footer
├── contact.html     # Contact page — form posts to my Email Sender API
├── style.css        # All styling & animations
├── script.js        # Preloader, scroll reveals, particles, tilt effect, nav
├── image/           # Project thumbnail images
└── README.md
```

## 🛠️ Built With

- HTML5
- CSS3 (custom properties, conic-gradient, keyframe animations)
- Vanilla JavaScript (Canvas API, IntersectionObserver)
- [Font Awesome](https://fontawesome.com/) for icons
- [Email Sender](https://email-sender-wy5o.onrender.com) — my own contact-form API (Node.js, Express, MongoDB, Flask mail relay) that delivers messages straight to my inbox

## 🚀 Running Locally

No build tools needed — it's static HTML/CSS/JS.

1. Clone or download this repository
2. Open `index.html` directly in a browser, **or** serve it locally:
   ```bash
   npx serve .
   ```
3. Visit the printed local URL

## 📌 Projects Shown

| Project | Stack |
|---|---|
| Email Sender | React, Node.js, Express, MongoDB, Flask, PWA |
| Friendly Flux (team) | HTML, CSS, JavaScript, Python, Flask |
| Beyonder AI (team) | HTML, CSS, JavaScript, Python, Flask, SQLite |
| AA News (team) | HTML, CSS, JavaScript, Python, Flask, SQLite |
| Beyonder AI | HTML, CSS, JavaScript |
| Weather App | HTML, CSS, JavaScript |
| Calculator | HTML, CSS, JavaScript |
| Tic-Tac-Toe | HTML, CSS, JavaScript |
| QR Code Generator | HTML, CSS, JavaScript |
| Result Analysis | HTML, CSS, JavaScript |

Each project card links to a live demo and its GitHub source.

## 📬 Contact

The [contact page](contact.html) sends messages through **Email Sender**, my own form-to-inbox API (a self-built alternative to Web3Forms/Formspree):

- The message is saved first and delivered in the background, so it is never lost even if the server is asleep
- Failed sends are retried automatically; a unique `submissionId` prevents duplicate emails
- A hidden honeypot field blocks simple bots, and the API key is checked on the server
- The full page URL is included in the email so I know where each message came from

You can also reach me via the social links in the footer.

## 📄 License

Free to use as a reference or starting point for your own portfolio.
