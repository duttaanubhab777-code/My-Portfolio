#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_gallery.py - generate every project-driven asset from projects.js.

``projects.js`` (plus the screenshots in ``image/``) is the single source of
truth. From it this script builds:

  1. Gallery SVG   An animated carousel with the real screenshots embedded.
                   portfolio -> assets/gallery.svg
                   profile   -> dist/live-gallery.svg
  2. Thumbnails    (portfolio only) lightweight WebP files in image/thumb/,
                   used by the website so mobile devices stay fast.
  3. README blocks Everything between ``<!-- NAME:START -->`` and
                   ``<!-- NAME:END -->`` markers is regenerated:
                       COUNTS    project-count badges
                       TECH      technology badges, ordered by usage
                       PROJECTS  project grid (portfolio) / tables (profile)
                       REPOS     (profile only) most recently updated repositories

The same file is used in both repositories.

  Portfolio repository (reads local files):
      python scripts/build_gallery.py --mode portfolio

  Profile repository (reads the portfolio over HTTPS, so no screenshots have
  to be stored in the profile repository):
      python scripts/build_gallery.py --mode profile \\
          --source https://raw.githubusercontent.com/<user>/My-Portfolio/main \\
          --repos --owner <user> --stamp

Requirements: Python 3.9+, Pillow (``pip install pillow``) and Node.js
(pre-installed on GitHub Actions runners). Node is only used to evaluate the
data section of projects.js.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import io
import json
import math
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import xml.dom.minidom
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps

# ───────────────────────── theme ─────────────────────────
BG, BG2, PANEL = "#0a0d22", "#1b2144", "#12173a"
ORANGE, AMBER, CORAL, INDIGO, VIOLET, GREEN = "#ff7a3d", "#ffb347", "#ff5a4f", "#7c8cff", "#a78bfa", "#3ddc84"
TXT, MUTED = "#ffffff", "#cbd2ff"

# Key of the site owner inside the PEOPLE object of projects.js. The owner is
# excluded when the collaborators ("backend by ...") line is generated.
OWNER_KEY = "anubhab"

KIND = {  # kind -> (label, gradient start, gradient end)
    "team": ("TEAM", CORAL, INDIGO),
    "fullstack": ("FULL-STACK", ORANGE, AMBER),
    "solo": ("SOLO", INDIGO, VIOLET),
}

# First matching rule wins. A project can override the result with an
# ``emoji`` field in projects.js.
EMOJI_RULES = [
    (r"email|mail", "📧"), (r"flux|physics|stem", "🧪"), (r"\bai\b|beyonder|chat|bot", "🤖"),
    (r"news", "📰"), (r"weather", "⛅"), (r"calc", "🧮"), (r"tic|tac|game", "⭕"),
    (r"qr", "🔳"), (r"result|analy", "📊"), (r"portfolio", "🌐"), (r"money|tracker|finance", "💸"),
    (r"math|solver", "➗"), (r"shop|store", "🛒"),
]

# Spelling normalisation for the ``tech`` arrays in projects.js.
TECH_ALIAS = {
    "js": "JavaScript", "sql lite": "SQLite", "sqlite": "SQLite", "jinja 2": "Jinja2", "jinja2": "Jinja2",
    "node": "Node.js", "nodejs": "Node.js", "apis": "REST API", "api": "REST API", "rest api": "REST API",
}
TECH_BADGE = {  # name -> (simple-icons logo, hex colour, logo colour)
    "HTML": ("html5", "E34F26", "white"), "CSS": ("css3", "1572B6", "white"),
    "JavaScript": ("javascript", "F7DF1E", "black"), "React": ("react", "20232A", "61DAFB"),
    "Vite": ("vite", "646CFF", "white"), "Node.js": ("nodedotjs", "339933", "white"),
    "Express": ("express", "000000", "white"), "MongoDB": ("mongodb", "47A248", "white"),
    "Mongoose": ("mongodb", "880000", "white"), "JWT": ("jsonwebtokens", "000000", "white"),
    "Flask": ("flask", "000000", "white"), "Python": ("python", "3776AB", "white"),
    "PWA": ("pwa", "5A0FC8", "white"), "SQLite": ("sqlite", "003B57", "white"),
    "Jinja2": ("jinja", "B41717", "white"), "REST API": (None, "7c8cff", "white"),
    "TypeScript": ("typescript", "3178C6", "white"), "Tailwind": ("tailwindcss", "06B6D4", "white"),
}


# ───────────────────────── fetching ─────────────────────────
def is_url(s: str) -> bool:
    return re.match(r"^https?://", s) is not None


def read_bytes(base: str, rel: str) -> bytes:
    """Read a file from ``base`` (local folder or raw URL). ``rel`` may itself be a full URL."""
    if is_url(rel):
        url = rel
    elif is_url(base):
        url = base.rstrip("/") + "/" + urllib.parse.quote(rel.lstrip("/"))
    else:
        return Path(base, rel).read_bytes()
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "portfolio-gallery-bot"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"cannot fetch {url}: {last}")


# ───────────────────────── projects.js -> data ─────────────────────────
def load_projects(base: str):
    """Evaluate only the data section of projects.js (PEOPLE + PROJECTS) with Node."""
    js = read_bytes(base, "projects.js").decode("utf-8")
    # Everything from the first of these markers onward is rendering code that
    # needs a browser DOM, so it is cut off before evaluation.
    cuts = [i for i in (js.find("const ICON_RULES"), js.find("function parseDesc"), js.find("document.")) if i > 0]
    head = js[: min(cuts)] if cuts else js
    code = head + "\nconsole.log(JSON.stringify({PEOPLE: typeof PEOPLE==='undefined'?{}:PEOPLE, PROJECTS: PROJECTS}));"
    if shutil.which("node") is None:
        sys.exit("error: Node.js is required to read projects.js but was not found on PATH")
    res = subprocess.run(["node", "-e", code], capture_output=True, text=True, timeout=30)
    if res.returncode != 0:
        sys.exit(f"error: could not evaluate projects.js (syntax error?):\n{res.stderr[:800]}")
    data = json.loads(res.stdout)
    return data["PEOPLE"], data["PROJECTS"]


def strip_tags(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def norm_tech(t: str) -> str:
    k = t.strip()
    return TECH_ALIAS.get(k.lower(), k)


def pick_emoji(p: dict) -> str:
    if p.get("emoji"):
        return p["emoji"]
    for pat, em in EMOJI_RULES:
        if re.search(pat, p["title"], re.I):
            return em
    return "🚀"


def normalize(raw: list):
    items = []
    for p in raw:
        kind = "team" if p.get("team") else ("fullstack" if p.get("type") == "fullstack" else "solo")
        lead = strip_tags(re.split(r"<br\s*/?>|<ul", p.get("desc", ""), maxsplit=1)[0])
        tech = []
        for t in p.get("tech", []):
            t = norm_tech(t)
            if t not in tech:
                tech.append(t)
        items.append({
            "title": strip_tags(p["title"]), "kind": kind, "lead": lead, "tech": tech,
            "image": p.get("image", ""), "fallback": p.get("fallback"),
            "demo": p.get("demo", ""), "code": p.get("code", ""),
            "emoji": pick_emoji(p), "gallery": p.get("gallery") is not False,
            "team": p.get("team") or [],
        })
    return items


# ───────────────────────── images ─────────────────────────
def open_image(base: str, item: dict):
    """Return the project screenshot as an RGB image, trying ``image`` then ``fallback``."""
    for ref in (item["image"], item.get("fallback")):
        if not ref:
            continue
        try:
            im = Image.open(io.BytesIO(read_bytes(base, ref)))
            im.load()
            im = ImageOps.exif_transpose(im)
            if im.mode in ("RGBA", "LA", "P"):
                im = im.convert("RGBA")
                bg = Image.new("RGB", im.size, (10, 13, 34))
                bg.paste(im, mask=im.split()[-1])
                return bg
            return im.convert("RGB")
        except Exception as e:  # noqa: BLE001
            print(f"  ! {item['title']}: could not load {ref} ({e})")
    return None


def crop_ratio(im: Image.Image, ratio_h_over_w: float) -> Image.Image:
    w, h = im.size
    if h / w > ratio_h_over_w:                       # too tall: keep the top part
        return im.crop((0, 0, w, int(w * ratio_h_over_w)))
    nw = int(h / ratio_h_over_w)                     # too wide: keep the centre
    x = (w - nw) // 2
    return im.crop((x, 0, x + nw, h))


def jpeg_b64(im: Image.Image, width: int, quality: int, ratio: float) -> str:
    im = crop_ratio(im, ratio).resize((width, int(width * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def make_thumbs(items: list, base: str, out_dir: Path):
    """Create image/thumb/<name>.webp - projects.js (thumbOf) loads exactly this path."""
    out_dir.mkdir(parents=True, exist_ok=True)
    mf_path = out_dir / ".manifest.json"
    try:
        mf = json.loads(mf_path.read_text())
    except Exception:  # noqa: BLE001
        mf = {}
    made, wanted = 0, set()
    for it in items:
        m = re.match(r"^image/([^/]+)\.\w+$", it["image"])
        if not m:
            continue
        stem = m.group(1)
        wanted.add(stem)
        try:
            raw = read_bytes(base, it["image"])
        except Exception:  # noqa: BLE001
            continue
        h = hashlib.sha1(raw).hexdigest()
        target = out_dir / f"{stem}.webp"
        if target.exists() and mf.get(stem) == h:
            continue
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        w = 480
        im = im.resize((w, max(1, int(im.height * w / im.width))), Image.LANCZOS)
        im.save(target, "WEBP", quality=74, method=6)
        mf[stem] = h
        made += 1
    # Remove thumbnails of projects that no longer exist.
    removed = 0
    for f in out_dir.glob("*.webp"):
        if f.stem not in wanted:
            f.unlink()
            mf.pop(f.stem, None)
            removed += 1
    mf_path.write_text(json.dumps(mf, indent=1, sort_keys=True))
    print(f"thumbnails: {made} created/updated, {removed} removed")


# ───────────────────────── gallery svg ─────────────────────────
W, CARD_W, CARD_H, GAP, TOP = 1000, 188, 376, 26, 78
H = TOP + CARD_H + 66
PRESETS = [(320, 70), (280, 64), (240, 58), (200, 52)]   # (image width in px, JPEG quality)
BUDGET = 2_300_000                                          # bytes of base64 image data; stays far below GitHub's 5 MB image limit


def esc(s) -> str:
    return html.escape(str(s), quote=True)


def build_gallery(items: list, images: list, counts: dict, stamp: str = "") -> str:
    ratio = CARD_H / CARD_W
    pairs = [(it, im) for it, im in zip(items, images) if it["gallery"]]
    n = len(pairs)
    if n == 0:
        sys.exit("error: no projects are enabled for the gallery")

    # Pick the sharpest preset whose total size fits the budget.
    blobs: list = []
    for width, q in PRESETS:
        blobs = [jpeg_b64(im, width, q, ratio) if im is not None else None for _, im in pairs]
        if sum(len(b) for b in blobs if b) <= BUDGET:
            break
    else:
        print("  ! gallery exceeds the size budget even at the lowest quality preset")

    step = CARD_W + GAP
    L = n * step
    copies = math.ceil(W / L) + 1
    dur = max(24, L / 38)
    x_start = GAP // 2 + 6

    defs, cards = [], []
    defs.append(f'<clipPath id="cp"><rect width="{CARD_W}" height="{CARD_H}" rx="22"/></clipPath>')
    defs.append(f'<clipPath id="frame"><rect width="{W}" height="{H}" rx="28"/></clipPath>')
    defs.append(f'<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="{BG2}"/></linearGradient>')
    defs.append(f'<linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="{BG}"/><stop offset=".09" stop-color="{BG}" stop-opacity="0"/><stop offset=".91" stop-color="{BG}" stop-opacity="0"/><stop offset="1" stop-color="{BG}"/></linearGradient>')
    defs.append(f'<linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG}" stop-opacity="0"/><stop offset=".55" stop-color="{BG}" stop-opacity=".82"/><stop offset="1" stop-color="{BG}" stop-opacity=".96"/></linearGradient>')
    defs.append(f'<linearGradient id="bar" x1="0" x2="1"><stop offset="0" stop-color="{ORANGE}" stop-opacity="0"/><stop offset=".5" stop-color="{AMBER}"/><stop offset="1" stop-color="{INDIGO}" stop-opacity="0"/></linearGradient>')
    defs.append('<linearGradient id="shn" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".10"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>')
    defs.append(f'<radialGradient id="o1"><stop offset="0" stop-color="{ORANGE}" stop-opacity=".30"/><stop offset="1" stop-color="{ORANGE}" stop-opacity="0"/></radialGradient>')
    defs.append(f'<radialGradient id="o2"><stop offset="0" stop-color="{INDIGO}" stop-opacity=".32"/><stop offset="1" stop-color="{INDIGO}" stop-opacity="0"/></radialGradient>')
    defs.append('<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#7c8cff" fill-opacity=".16"/></pattern>')
    for k, (_, a, b) in KIND.items():
        defs.append(f'<linearGradient id="k_{k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>')

    for i, ((it, _), blob) in enumerate(zip(pairs, blobs)):
        label, ca, _cb = KIND[it["kind"]]
        if blob:
            defs.append(f'<image id="im{i}" width="{CARD_W}" height="{CARD_H}" preserveAspectRatio="xMidYMin slice" href="data:image/jpeg;base64,{blob}"/>')
            pic = f'<use href="#im{i}"/>'
        else:  # no screenshot available: render a neutral placeholder card
            pic = (f'<rect width="{CARD_W}" height="{CARD_H}" fill="url(#k_{it["kind"]})" fill-opacity=".35"/>'
                   f'<text x="{CARD_W/2}" y="{CARD_H/2}" text-anchor="middle" font-size="64" fill="#fff" fill-opacity=".8" '
                   f'font-family="Segoe UI,Arial,sans-serif" font-weight="800">{esc(it["title"][:1].upper())}</text>')
        t = it["title"]
        fs = 16 if len(t) <= 16 else max(11, round(16 * 16 / len(t), 1))
        tech = " · ".join(it["tech"][:5])
        if len(tech) > 30:
            tech = tech[:29].rstrip(" ·") + "…"
        chip_w = 14 + len(label) * 6.6
        cards.append(
            f'<g transform="translate({i * step + x_start},{TOP})">'
            f'<rect x="-6" y="-6" width="{CARD_W + 12}" height="{CARD_H + 12}" rx="30" fill="{PANEL}" stroke="url(#k_{it["kind"]})" stroke-width="2.5"/>'
            f'<g clip-path="url(#cp)">{pic}<rect y="{CARD_H - 104}" width="{CARD_W}" height="104" fill="url(#scrim)"/></g>'
            f'<rect x="10" y="10" width="{chip_w:.0f}" height="20" rx="10" fill="{ca}"/>'
            f'<text x="{10 + chip_w / 2:.0f}" y="24" text-anchor="middle" font-size="9.5" font-weight="800" letter-spacing="1.2" fill="{BG}">{label}</text>'
            f'<text x="{CARD_W - 12}" y="26" text-anchor="end" font-size="12" font-weight="700" fill="#fff" fill-opacity=".75" font-family="Consolas,Menlo,monospace">{i + 1:02d}</text>'
            f'<text x="14" y="{CARD_H - 44}" font-size="{fs}" font-weight="800" fill="{TXT}">{esc(t)}</text>'
            f'<text x="14" y="{CARD_H - 25}" font-size="10" fill="{MUTED}">{esc(tech)}</text>'
            f'</g>'
        )

    strip = f'<g id="strip">{"".join(cards)}</g>'
    runs = "".join(f'<use href="#strip" x="{k * L}"/>' for k in range(copies))
    stats = f'{counts["projects"]} PROJECTS · {counts["team"]} TEAM · {counts["fullstack"]} FULL-STACK · {counts["tech"]} TECHS'
    footer = "LIVE SHOWCASE · SYNCED AUTOMATICALLY" + (f" · UPDATED {stamp}" if stamp else "")

    css = f"""
text{{font-family:'Segoe UI',Arial,sans-serif}}
.mq{{animation:mq {dur:.0f}s linear infinite}}
@keyframes mq{{to{{transform:translateX(-{L}px)}}}}
.sheen{{animation:sh 7s ease-in-out infinite}}
@keyframes sh{{0%{{transform:translateX(-260px) skewX(-18deg)}}60%,100%{{transform:translateX({W + 120}px) skewX(-18deg)}}}}
.o1{{animation:o1 11s ease-in-out infinite}}@keyframes o1{{50%{{transform:translate(120px,24px)}}}}
.o2{{animation:o2 13s ease-in-out infinite}}@keyframes o2{{50%{{transform:translate(-130px,-18px)}}}}
.ring{{transform-box:fill-box;transform-origin:center;animation:ring 1.9s ease-out infinite}}
@keyframes ring{{0%{{transform:scale(1);opacity:.85}}100%{{transform:scale(3);opacity:0}}}}
.pulse{{animation:pl 3s ease-in-out infinite}}@keyframes pl{{50%{{opacity:.45}}}}
.bar{{animation:bar 5s ease-in-out infinite}}@keyframes bar{{0%,100%{{transform:translateX(-30px)}}50%{{transform:translateX(30px)}}}}
@media (prefers-reduced-motion:reduce){{.mq,.sheen,.o1,.o2,.bar,.pulse,.ring{{animation:none}}}}
"""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="Animated project gallery">'
        f'<title>Project gallery</title>'
        f'<defs>{"".join(defs)}{strip}</defs><style>{css}</style>'
        f'<g clip-path="url(#frame)">'
        f'<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#dots)"/>'
        f'<circle class="o1" cx="180" cy="120" r="260" fill="url(#o1)"/><circle class="o2" cx="840" cy="400" r="280" fill="url(#o2)"/>'
        f'<circle cx="34" cy="30" r="5" fill="{GREEN}"/><circle class="ring" cx="34" cy="30" r="5" fill="none" stroke="{GREEN}" stroke-width="1.5"/>'
        f'<text x="50" y="35" font-size="13" font-weight="800" letter-spacing="4" fill="{AMBER}" class="pulse">PROJECT GALLERY</text>'
        f'<text x="{W - 30}" y="35" text-anchor="end" font-size="11" font-weight="600" letter-spacing="1.5" fill="{MUTED}" fill-opacity=".8">{esc(stats)}</text>'
        f'<rect class="bar" x="40" y="54" width="{W - 80}" height="2" rx="1" fill="url(#bar)"/>'
        f'<g class="mq">{runs}</g>'
        f'<rect class="sheen" x="0" y="{TOP - 10}" width="120" height="{CARD_H + 20}" fill="url(#shn)"/>'
        f'<rect width="{W}" height="{H}" fill="url(#fade)"/>'
        f'<text x="{W / 2}" y="{H - 24}" text-anchor="middle" font-size="10.5" letter-spacing="2" fill="{INDIGO}" fill-opacity=".85">{esc(footer)}</text>'
        f'</g>'
        f'<rect x=".75" y=".75" width="{W - 1.5}" height="{H - 1.5}" rx="28" fill="none" stroke="#262d5c" stroke-width="1.5"/>'
        f'</svg>\n'
    )


# ───────────────────────── README sections ─────────────────────────
def shield_label(s: str) -> str:
    return urllib.parse.quote(s.replace("-", "--").replace("_", "__").replace(" ", "_"), safe="_-.")


def counts_of(items: list) -> dict:
    techs = {t for it in items for t in it["tech"]}
    return {
        "projects": len(items),
        "team": sum(1 for i in items if i["kind"] == "team"),
        "fullstack": sum(1 for i in items if i["kind"] == "fullstack"),
        "solo": sum(1 for i in items if i["kind"] == "solo"),
        "tech": len(techs),
    }


def md_counts(c: dict) -> str:
    def b(label, val, col):
        return f'<img src="https://img.shields.io/badge/{shield_label(label)}-{val}-{col}?style=for-the-badge&labelColor=0a0d22" alt="{label} {val}" />'
    return " ".join([
        b("Projects", c["projects"], "ff7a3d"), b("Team", c["team"], "ff5a4f"),
        b("Full-Stack", c["fullstack"], "ffb347"), b("Solo", c["solo"], "7c8cff"),
        b("Technologies", c["tech"], "a78bfa"),
    ])


def md_tech(items: list) -> str:
    freq: dict[str, int] = {}
    for it in items:
        for t in it["tech"]:
            freq[t] = freq.get(t, 0) + 1
    out = []
    for t, _ in sorted(freq.items(), key=lambda kv: (-kv[1], kv[0].lower())):
        logo, col, lc = TECH_BADGE.get(t, (None, "262d5c", "white"))
        url = f"https://img.shields.io/badge/{shield_label(t)}-{col}?style=for-the-badge"
        if logo:
            url += f"&logo={logo}&logoColor={lc}"
        out.append(f'<img src="{url}" alt="{esc(t)}" />')
    return "\n".join(out)


def gh_profile(url: str) -> str:
    m = re.match(r"https?://([^./]+)\.github\.io", url or "")
    return f"https://github.com/{m.group(1)}" if m else url


def partners(items: list, people: dict, me: str = OWNER_KEY) -> str:
    seen, parts = [], []
    for it in items:
        for m in it["team"]:
            k = m.get("who")
            if k and k != me and k not in seen and k in people:
                seen.append(k)
                parts.append(f"[{people[k]['name']}]({gh_profile(people[k].get('github', ''))})")
    return " & ".join(parts)


def md_pipe(s: str) -> str:
    return s.replace("|", "\\|")


def short(s: str, n: int = 150) -> str:
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def md_profile_projects(items: list, people: dict, me: str) -> str:
    def table(rows):
        lines = ["| Project | What it is | Stack |", "|---|---|---|"]
        for it in rows:
            links = f"[**{md_pipe(it['title'])}**]({it['code']}) · [Live]({it['demo']})"
            stack = " ".join(f"`{t}`" for t in it["tech"][:6])
            lines.append(f"| {it['emoji']} {links} | {md_pipe(short(it['lead']))} | {stack} |")
        return "\n".join(lines)

    groups = [
        ("### 🧱 Full-Stack (built solo)", [i for i in items if i["kind"] == "fullstack"]),
        (f"### 🤝 Collaborations (frontend by me · backend by {partners(items, people, me) or 'my team'})",
         [i for i in items if i["kind"] == "team"]),
        ("### 🚀 More Projects", [i for i in items if i["kind"] == "solo"]),
    ]
    return "\n\n".join(f"{h}\n\n{table(r)}" for h, r in groups if r)


def md_portfolio_projects(items: list, thumb_dir: Path) -> str:
    def img_path(it):
        m = re.match(r"^image/([^/]+)\.\w+$", it["image"])
        if m and (thumb_dir / f"{m.group(1)}.webp").exists():
            return f"image/thumb/{m.group(1)}.webp"
        return it["image"]

    def cell(it):
        sub = " · ".join(it["tech"][:5])
        return (f'<td align="center" width="33%" valign="top">\n'
                f'  <a href="{esc(it["demo"])}"><img src="{esc(img_path(it))}" width="190" alt="{esc(it["title"])}" /></a><br/>\n'
                f'  <b>{it["emoji"]} {esc(it["title"])}</b><br/><sub>{esc(sub)}</sub><br/>\n'
                f'  <a href="{esc(it["demo"])}">Live</a> · <a href="{esc(it["code"])}">Code</a>\n</td>')

    def grid(rows):
        trs = []
        for k in range(0, len(rows), 3):
            chunk = rows[k:k + 3]
            tds = [cell(r) for r in chunk] + ["<td></td>"] * (3 - len(chunk))
            trs.append("<tr>\n" + "\n".join(tds) + "\n</tr>")
        return '<div align="center">\n<table>\n' + "\n".join(trs) + "\n</table>\n</div>"

    groups = [
        ("### 🧱 Full-Stack (built solo)", [i for i in items if i["kind"] == "fullstack"]),
        ("### 🤝 Collaborations", [i for i in items if i["kind"] == "team"]),
        ("### 🚀 My Projects", [i for i in items if i["kind"] == "solo"]),
    ]
    return "\n\n".join(f"{h}\n\n{grid(r)}" for h, r in groups if r)


def fetch_repos_md(owner: str, token: str | None, skip: set[str]) -> str | None:
    url = f"https://api.github.com/users/{owner}/repos?sort=pushed&direction=desc&per_page=30&type=owner"
    headers = {"User-Agent": "portfolio-gallery-bot", "Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
            repos = json.load(r)
    except Exception as e:  # noqa: BLE001
        print(f"  ! repositories API request failed ({e}); the REPOS section is left unchanged")
        return None
    rows = [r for r in repos if not r.get("fork") and not r.get("archived") and r["name"].lower() not in skip][:6]
    if not rows:
        return None
    lines = ["| Repository | About | Language | Last push |", "|---|---|---|---|"]
    for r in rows:
        star = f" ⭐ {r['stargazers_count']}" if r.get("stargazers_count") else ""
        about = md_pipe(short((r.get("description") or "—").strip(), 90))
        lang = f"`{r['language']}`" if r.get("language") else "—"
        lines.append(f"| [**{r['name']}**]({r['html_url']}){star} | {about} | {lang} | {r['pushed_at'][:10]} |")
    return "\n".join(lines)


def inject(text: str, name: str, content: str) -> tuple[str, bool]:
    """Replace the content between <!-- NAME:START --> and <!-- NAME:END -->."""
    pat = re.compile(rf"(<!--\s*{name}:START\s*-->)(.*?)(<!--\s*{name}:END\s*-->)", re.S)
    if not pat.search(text):
        return text, False
    return pat.sub(lambda m: f"{m.group(1)}\n{content}\n{m.group(3)}", text), True


# ───────────────────────── main ─────────────────────────
def main():
    ap = argparse.ArgumentParser(description="Generate the gallery SVG, thumbnails and README sections from projects.js.")
    ap.add_argument("--mode", choices=["portfolio", "profile"], default="portfolio")
    ap.add_argument("--source", default=".", help="where projects.js and image/ live: a local folder or a raw URL")
    ap.add_argument("--svg", default=None, help="output path of the gallery SVG")
    ap.add_argument("--readme", default="README.md")
    ap.add_argument("--no-readme", action="store_true", help="skip the README sections")
    ap.add_argument("--no-thumbs", action="store_true", help="skip thumbnail generation (portfolio mode)")
    ap.add_argument("--repos", action="store_true", help="(profile) refresh the recently updated repositories table")
    ap.add_argument("--owner", default=os.environ.get("GH_USER", ""), help="GitHub username used for --repos")
    ap.add_argument("--me", default=OWNER_KEY, help="key of the site owner in PEOPLE (excluded from the collaborators line)")
    ap.add_argument("--stamp", action="store_true", help="print the UTC update time inside the gallery SVG")
    args = ap.parse_args()

    svg_path = Path(args.svg or ("assets/gallery.svg" if args.mode == "portfolio" else "dist/live-gallery.svg"))

    people, raw = load_projects(args.source)
    items = normalize(raw)
    if not items:
        sys.exit("error: no projects found in projects.js; nothing was changed")
    print(f"{len(items)} projects found: " + ", ".join(i["title"] for i in items))

    images = [open_image(args.source, it) for it in items]
    if not any(im is not None for im, it in zip(images, items) if it["gallery"]):
        sys.exit("error: no screenshot could be loaded; the gallery was not changed")

    thumb_dir = Path("image/thumb")
    if args.mode == "portfolio" and not args.no_thumbs:
        make_thumbs(items, args.source, thumb_dir)

    c = counts_of(items)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC") if args.stamp else ""
    svg = build_gallery(items, images, c, stamp)
    xml.dom.minidom.parseString(svg.encode("utf-8"))          # fail early if the SVG is not well-formed
    svg_path.parent.mkdir(parents=True, exist_ok=True)
    svg_path.write_text(svg, encoding="utf-8")
    print(f"gallery -> {svg_path} ({len(svg) / 1024:.0f} KB)")

    if args.no_readme:
        return
    rp = Path(args.readme)
    if not rp.exists():
        print(f"README not found ({rp}); skipping README sections")
        return
    text = original = rp.read_text(encoding="utf-8")
    text, _ = inject(text, "COUNTS", md_counts(c))
    text, _ = inject(text, "TECH", md_tech(items))
    if args.mode == "portfolio":
        text, _ = inject(text, "PROJECTS", md_portfolio_projects(items, thumb_dir))
    else:
        text, _ = inject(text, "PROJECTS", md_profile_projects(items, people, args.me))
        if args.repos and args.owner:
            repos = fetch_repos_md(args.owner, os.environ.get("GH_TOKEN"), {args.owner.lower(), "my-portfolio"})
            if repos:
                text, _ = inject(text, "REPOS", repos)
    if text != original:
        rp.write_text(text, encoding="utf-8")
        print("README updated")
    else:
        print("README unchanged")


if __name__ == "__main__":
    main()
