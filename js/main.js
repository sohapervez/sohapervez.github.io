/* main.js — card rendering, scroll animations, nav */

// ── Nav scroll behaviour ─────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.site-nav');
  const hero = document.querySelector('#hero');
  if (!nav || !hero) return;
  const obs = new IntersectionObserver(
    ([e]) => nav.classList.toggle('scrolled', !e.isIntersecting),
    { threshold: 0 }
  );
  obs.observe(hero);
}

// ── Scroll-in animations ─────────────────────────────────────
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );
  document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
}

function observeNewAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-animate]:not(.visible)').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );
  document.querySelectorAll('[data-animate]:not(.visible)').forEach(el => obs.observe(el));
}

// ── Pipeline preview HTML (EVIL-AI RAG) ──────────────────────
function pipelinePreview() {
  return `<div class="pipeline-viz">
    <div class="pipeline-row">
      <span class="pn">PDF</span><span class="pa">→</span>
      <span class="pn">Parse</span><span class="pa">→</span>
      <span class="pn">Chunk</span><span class="pa">→</span>
      <span class="pn">Embed</span>
    </div>
    <div class="pipeline-row">
      <span class="pn">ChromaDB</span><span class="pa">+</span>
      <span class="pn">BM25</span><span class="pa">→</span>
      <span class="pn">Hybrid</span><span class="pa">→</span>
      <span class="pn">Rerank</span>
    </div>
    <div class="pipeline-row">
      <span class="pa">↓</span>
      <span class="pn">LLM</span><span class="pa">→</span>
      <span class="pn accent">Cited Answer</span>
    </div>
  </div>`;
}

function getPreviewHtml(p) {
  if (p.previewPoster) {
    const webmSrc = p.previewWebm ? `<source src="${escHtml(p.previewWebm)}" type="video/webm">` : '';
    const mp4Src  = p.preview     ? `<source src="${escHtml(p.preview)}"     type="video/mp4">` : '';
    const caption = p.previewCaption
      ? `<div class="eng-preview-caption">${escHtml(p.previewCaption)}</div>` : '';
    const touchPlay = `<div class="eng-touch-play" aria-hidden="true">▶</div>`;
    const link = p.previewLink
      ? `<a class="eng-preview-link" href="${escHtml(p.previewLink)}" target="_blank" rel="noopener noreferrer" aria-label="Watch demo on GitHub"></a>` : '';
    return `<div class="eng-preview-media">
      <img class="eng-poster" src="${escHtml(p.previewPoster)}" alt="${escHtml(p.title)} preview" loading="lazy">
      <video class="eng-video" muted loop playsinline preload="none">${webmSrc}${mp4Src}</video>
      ${caption}${touchPlay}${link}
    </div>`;
  }
  if (p.preview) {
    const isVideo = /\.(mp4|webm)$/i.test(p.preview);
    return isVideo
      ? `<video class="eng-card-video" src="${escHtml(p.preview)}" muted loop playsinline preload="none"></video>`
      : `<img src="${escHtml(p.preview)}" alt="${escHtml(p.title)} preview" loading="lazy">`;
  }
  if (p.previewType === 'pipeline') return pipelinePreview();
  return `<div class="preview-placeholder">${escHtml(p.title.charAt(0))}</div>`;
}

// ── Escape helper ────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Format STAR text (bold the arrows) ──────────────────────
function formatStar(text) {
  return escHtml(text).replace(/→/g, '<strong>→</strong>');
}

// ── Engineering cards ────────────────────────────────────────
function renderFeaturedCard(p) {
  const links = [
    p.caseStudy ? `<a class="project-link" href="${p.caseStudy}">Case study →</a>` : '',
    p.repo      ? `<a class="project-link" href="${escHtml(p.repo)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : '',
    p.demo      ? `<a class="project-link" href="${escHtml(p.demo)}" target="_blank" rel="noopener noreferrer">Demo ↗</a>` : '',
  ].filter(Boolean).join('');

  const chips = p.stack
    .map(s => `<span class="chip">${escHtml(s)}</span>`)
    .join('');

  const bgStyle = p.cardColor ? ` style="background:${p.cardColor}"` : '';
  return `
    <article class="project-card"${bgStyle} data-animate>
      <div class="project-card-preview">${getPreviewHtml(p)}</div>
      <div class="project-card-body">
        <h3>${escHtml(p.title)}</h3>
        <p class="project-star">${formatStar(p.star)}</p>
        <div class="project-chips">${chips}</div>
        <div class="project-links">${links}</div>
      </div>
    </article>`;
}

function renderEarlierItem(p) {
  const chips = p.stack.slice(0, 3)
    .map(s => `<span class="chip">${escHtml(s)}</span>`)
    .join('');
  const link = p.repo
    ? `<a class="earlier-item-link" href="${escHtml(p.repo)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`
    : '';
  return `
    <li class="earlier-item" data-animate>
      <h4>${escHtml(p.title)}</h4>
      <div class="earlier-chips">${chips}</div>
      ${link}
    </li>`;
}

async function renderEngineering() {
  const grid = document.getElementById('projects-grid');
  const list = document.getElementById('earlier-list');
  if (!grid) return;

  let projects;
  try {
    const res = await fetch('data/projects.json');
    projects = await res.json();
  } catch {
    grid.innerHTML = '<p class="loading-msg">Could not load projects. Open via Live Server or a local HTTP server.</p>';
    return;
  }

  const featured = projects.filter(p => p.featured);
  const earlier  = projects.filter(p => !p.featured);

  grid.innerHTML = featured.map(renderFeaturedCard).join('');
  if (list) list.innerHTML = earlier.map(renderEarlierItem).join('');
}

// ── Engineering interactions ──────────────────────────────────
function initEngineeringInteractions() {
  document.querySelectorAll('.project-card').forEach(card => {
    const vid   = card.querySelector('.eng-video, .eng-card-video');
    if (!vid) return;
    const media   = card.querySelector('.eng-preview-media');
    const hasLink = card.querySelector('.eng-preview-link');

    // Desktop hover: play on enter, pause+reset on leave
    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
      media && media.classList.remove('is-playing');
    });

    // Touch tap (no link overlay): toggle play/pause in place
    if (!hasLink && media) {
      media.addEventListener('click', () => {
        if (vid.paused) {
          vid.play().catch(() => {});
          media.classList.add('is-playing');
        } else {
          vid.pause();
          media.classList.remove('is-playing');
        }
      });
    }
  });
}

// ── Creative gallery ─────────────────────────────────────────
function renderCreativeTile(t) {
  if (t.isPlaceholder) {
    return `
      <div class="creative-tile placeholder" data-animate>
        <span class="placeholder-badge">coming soon</span>
        <div class="creative-tile-info"><h3>${escHtml(t.title)}</h3></div>
      </div>`;
  }

  if (t.type === 'video') {
    const tags     = t.tools.map(s => `<span class="tool-tag">${escHtml(s)}</span>`).join('');
    const isWide   = t.aspect === '16:9';
    const wideClass = isWide ? ' creative-tile--wide' : '';
    const aspectStyle = isWide ? ' style="aspect-ratio:16/9"' : '';
    return `
      <div class="creative-tile creative-tile--video${wideClass}" data-animate
           data-embed-url="${escHtml(t.embedUrl)}"
           data-linkedin-url="${escHtml(t.linkedinUrl)}"
           data-process="${escHtml(t.process)}"
           data-title="${escHtml(t.title)}"
           data-aspect="${escHtml(t.aspect || '9:16')}"
           role="button" tabindex="0"
           aria-label="Watch ${escHtml(t.title)}">
        <div class="ct-media"${aspectStyle}>
          <img class="ct-poster" src="${escHtml(t.poster)}" alt="${escHtml(t.title)}" loading="lazy">
          <video class="ct-video" muted loop playsinline preload="none">
            <source src="${escHtml(t.preview.webm)}" type="video/webm">
            <source src="${escHtml(t.preview.mp4)}"  type="video/mp4">
          </video>
          <div class="ct-play" aria-hidden="true">▶</div>
        </div>
        <div class="creative-tile-info">
          <h3>${escHtml(t.title)}</h3>
          <div class="creative-tile-tags">${tags}</div>
        </div>
      </div>`;
  }

  // Generic image tile (e.g. Temu)
  const thumb = t.thumbnail
    ? `<img class="creative-tile-thumb" src="${escHtml(t.thumbnail)}" alt="${escHtml(t.title)}" loading="lazy">`
    : '';
  const link = t.linkedIn
    ? `<a class="creative-tile-link" href="${escHtml(t.linkedIn)}" target="_blank" rel="noopener noreferrer">View on LinkedIn ↗</a>`
    : '';
  const paid = t.note ? `<p class="creative-tile-paid">${escHtml(t.note)}</p>` : '';
  return `
    <div class="creative-tile" data-animate>
      ${thumb}
      <div class="creative-tile-info">
        <h3>${escHtml(t.title)}</h3>
        <p class="creative-tile-tools">${escHtml(t.tools.join(' · '))}</p>
        ${link}${paid}
      </div>
    </div>`;
}

async function renderCreative() {
  const grid = document.getElementById('creative-grid');
  if (!grid) return;
  let tiles;
  try {
    const res = await fetch('data/creative.json');
    tiles = await res.json();
  } catch {
    grid.innerHTML = '<p class="loading-msg">Could not load creative content.</p>';
    return;
  }
  grid.innerHTML = tiles.map(renderCreativeTile).join('');
}

// ── Lightbox ──────────────────────────────────────────────────
function createLightbox() {
  if (document.getElementById('lb')) return;
  const el = document.createElement('div');
  el.id = 'lb';
  el.className = 'lb-backdrop';
  el.setAttribute('hidden', '');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <div class="lb-dialog">
      <div class="lb-header">
        <button class="lb-close" aria-label="Close lightbox">✕</button>
      </div>
      <div class="lb-frame-wrap">
        <iframe id="lb-iframe" frameborder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowfullscreen></iframe>
      </div>
      <div class="lb-footer">
        <p id="lb-process" class="lb-process"></p>
        <a id="lb-btn" href="#" target="_blank" rel="noopener noreferrer" class="lb-linkedin-btn">
          View on LinkedIn ↗
        </a>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => { if (e.target === el) closeLightbox(); });
  el.querySelector('.lb-close').addEventListener('click', closeLightbox);
}

function openLightbox(ds) {
  const lb = document.getElementById('lb');
  if (!lb) return;
  document.getElementById('lb-iframe').src = ds.embedUrl;
  document.getElementById('lb-process').textContent = ds.process || '';
  document.getElementById('lb-btn').href = ds.linkedinUrl || '#';
  lb.classList.toggle('lb--wide', ds.aspect === '16:9');
  lb.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lb-close').focus();
}

function closeLightbox() {
  const lb = document.getElementById('lb');
  if (!lb || lb.hasAttribute('hidden')) return;
  lb.setAttribute('hidden', '');
  lb.classList.remove('lb--wide');
  document.getElementById('lb-iframe').src = '';
  document.body.style.overflow = '';
}

// ── Creative interactions ─────────────────────────────────────
function initCreativeInteractions() {
  createLightbox();
  document.querySelectorAll('.creative-tile--video').forEach(tile => {
    const vid = tile.querySelector('.ct-video');

    // Desktop hover: play/pause preview
    tile.addEventListener('mouseenter', () => vid && vid.play().catch(() => {}));
    tile.addEventListener('mouseleave', () => { if (vid) { vid.pause(); vid.currentTime = 0; } });

    // Click / tap / keyboard → lightbox
    const open = () => openLightbox(tile.dataset);
    tile.addEventListener('click', open);
    tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ── Boot ─────────────────────────────────────────────────────
async function init() {
  initNav();
  initScrollAnimations();
  await Promise.all([renderEngineering(), renderCreative()]);
  observeNewAnimations();
  initEngineeringInteractions();
  initCreativeInteractions();
}

document.addEventListener('DOMContentLoaded', init);
