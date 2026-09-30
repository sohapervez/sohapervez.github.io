# Soha Pervez — Portfolio Website

Personal portfolio for **Soha Pervez**, AI Engineer · Data Scientist · AI Content Creator.
Based in Finland, open to relocate. Email: sohapervez@gmail.com · GitHub: https://github.com/sohapervez
LinkedIn: _TODO — ask Soha for the URL_

The site must show **two sides** of her work, clearly separated but in one site:
1. **AI Engineering** — LLM/RAG systems, ML models, safety research (GitHub projects)
2. **AI Creative / Marketing** — AI-generated videos and images (posted on LinkedIn)

## Tech & hosting (must stay 100% free)
- Static site: plain **HTML + CSS + vanilla JavaScript** (no framework unless there's a strong reason; if one is needed, use Astro).
- No build step required to preview: `index.html` should work when opened directly or via VS Code Live Server.
- Hosted on **GitHub Pages** from the repo `sohapervez/sohapervez.github.io` → live at https://sohapervez.github.io
- Keep every file small: videos ≤ ~3 MB, hover previews ≤ ~1.5 MB, images as WebP ≤ ~300 KB.
- Full-length project videos are **not** stored in the repo — embed them from YouTube (unlisted) / Loom / LinkedIn "Embed this post".

## Existing assets (already in this folder)
- `assets/video/follow-cursor.mp4` — hero video: she turns her head left → centre → right over 3 s.
  Every frame is a keyframe (required for smooth scrubbing — do not re-encode without `-g 1`).
- `js/cursor-scrub.js` — **working, tested** script that scrubs the video with the cursor.
  `initCursorScrub(videoEl, { trackingArea, smoothing, onProgress, idleSweep })`.
  On touch devices (no cursor) she slowly looks left/right on her own (`idleSweep`).
  Respects `prefers-reduced-motion`. Do not rewrite it from scratch; extend it if needed.
- `hero-test.html` — minimal working demo of the hero. Use it as the starting point for the real hero, then delete it.

## Page structure (one long scrolling page: `index.html`)
1. **Hero** — full-screen (`100svh`) cursor-scrub video, `object-fit: cover`.
   - Name + one-line tagline. **Place text so it doesn't cover her face/hair** (she's centred; hair reaches ~15% from top). Prefer bottom-left or a left/right column.
   - Two labels: **"AI Engineer"** (left) and **"AI Creator"** (right). The label on the side she's looking at lights up (use `onProgress`; p < 0.4 = left, p > 0.6 = right). Clicking scrolls to that section.
   - Small caption: "This hero was made with AI video + custom code."
   - Scroll cue at the bottom.
2. **Proof strip** — scrolling marquee of numbers: 35% sawing-accuracy gain @ Finnos Oy · 97% brain-tumor classifier accuracy · open-source AI projects · AI videos created (fill real numbers when Soha provides them).
3. **Engineering** (`#engineering`) — dark, code-flavoured styling (monospace accents). Large cards for featured projects; each card has a hover preview (short silent looping video or image), title, one-line outcome, tech tags, and links (Case study · GitHub · Demo video).
4. **Creative** (`#creative`) — vivid, image-first styling. Masonry/grid gallery of AI videos & images. Hover plays preview. Each tile: title, tools used, optional prompt reveal on hover, "View on LinkedIn" link. Frame marketing pieces as Brief → Concept → Result where possible.
5. **Skills & tools** — grouped logos/chips (LLMs & RAG · ML & Data · Deployment · AI video/image tools). **No percentage skill bars.**
6. **About + Experience timeline** — short bio, Finnos Oy role, education, CV download (PDF).
7. **Contact** — email, LinkedIn, GitHub. Simple and prominent.

Each featured engineering project also gets its own page `projects/<slug>.html` using the format:
**Problem → What I built → Stack → Result → Links**, with an embedded demo video if available.

## Projects (content source of truth: `data/projects.json` — create it; render cards from it so adding a project = adding an entry)

### Featured — Engineering
| Slug | Title | Summary | Stack | Result / highlight | Repo |
|---|---|---|---|---|---|
| evil-ai-rag | EVIL-AI RAG | RAG system for querying AI-safety research papers: upload PDFs, ask questions, get cited answers. Pipeline: PDF → parser → parent-child chunking → embeddings → ChromaDB → hybrid (vector + BM25) retrieval → cross-encoder rerank → LLM. | Python, LlamaIndex, ChromaDB, BGE embeddings, BM25, cross-encoder reranker, FastAPI, Streamlit, OpenShift; LLMs via Ollama/OpenAI/Anthropic/Groq | Flagship. Show the pipeline as an animated diagram. | https://github.com/sohapervez/EVIL-AI-RAG |
| llm-red-teaming | LLM Red-Teaming Toolkit | Tools for LLM safety evaluation: probes models with jailbreak-style prompts, scores replies with a heuristic evaluator (refusal, specificity, length, keyword signals), and generates adversarial prompt variants (paraphrase, obfuscation, roleplay). | Python, LangChain, Ollama, OpenAI-compatible APIs, asyncio | Frame as **AI safety research**. Never display actual harmful prompts/outputs — show the scoring/evaluation pipeline. Repo README has a demo video. | https://github.com/sohapervez/LLM-jailbreaking |
| ai-diagnostic-assistant | AI Diagnostic Assistant | Streamlit chatbot: user describes a symptom, the app generates 3–5 follow-up questions, then gives a likely diagnosis with explanation using an LLM + RAG over a medical CSV knowledge base. | Python, Streamlit, LLaMA 2 via Ollama, LangChain, vector store | Add a "not medical advice" note. | https://github.com/sohapervez/AI-Diagnostic-Assistant |
| finnos-ml | ML Models @ Finnos Oy | 4 ML models for sawmill operations (work project; code private). | _TODO: ask Soha_ | Improved sawing accuracy by **35%** | — (no public repo) |
| brain-tumor-classification | Brain Tumor Classifier | CNN classifying brain MRI images as healthy vs tumour, comparing a from-scratch model with transfer learning. | Python, TensorFlow/Keras, transfer learning | 91% from scratch → **97%** with transfer learning (confirm with Soha: GitHub profile says 95%) | https://github.com/sohapervez/brain-tumor-classification |

### Earlier work (small list at the bottom of Engineering, not big cards)
- Zomato EDA — exploratory data analysis of restaurant data (pandas, seaborn) — https://github.com/sohapervez/Zomato-EDA
- Rock vs Mine Prediction — logistic regression on sonar data — https://github.com/sohapervez/rock-vs-mine-prediction
- Streamlit Announcements App — https://github.com/sohapervez/streamlit-announcements-app

### Creative
_TODO — Soha will provide: AI videos/images (files or thumbnails), titles, tools used (e.g. NoteGPT), prompts, and the LinkedIn post URL for each._
Until then, build the gallery with clearly-marked placeholder tiles driven by `data/creative.json`.

## Design direction
- Dark overall theme; engineering section = dark + monospace accents + subtle grid; creative section = richer colour, big imagery.
- One accent colour for engineering, one for creative, so visitors feel the switch.
- Smooth but restrained motion: fade/slide-in on scroll (IntersectionObserver), hover previews. Respect `prefers-reduced-motion`.
- Fully responsive; test at 375px (phone), 768px, 1440px. No horizontal scroll on mobile.
- Accessibility: semantic HTML, alt text, visible focus states, good contrast.

## SEO / sharing
- `<title>`, meta description, Open Graph + Twitter card image (a still of the hero with her name), favicon.

## Workflow rules
- Preview locally with VS Code **Live Server** (or `python3 -m http.server`).
- Commit in small steps with clear messages. Deploy by pushing to `main` on `sohapervez.github.io`.
- Mark missing info as `TODO` in content rather than inventing facts, numbers, or links.
