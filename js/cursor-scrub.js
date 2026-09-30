/**
 * cursor-scrub.js — makes a <video> follow the cursor by scrubbing its playhead.
 * Plain JavaScript, no libraries. Ported from the Framer CursorScrubVideo component.
 *
 * Usage:
 *   <video class="scrub-video" src="assets/video/follow-cursor.mp4"
 *          muted playsinline preload="auto"></video>
 *   <script src="js/cursor-scrub.js"></script>
 *   <script>
 *     initCursorScrub(document.querySelector(".scrub-video"), { trackingArea: "window" });
 *   </script>
 *
 * (Classic script, not a module, so it also works when index.html is opened by double-click.)
 *
 * The video MUST have every frame as a keyframe, or scrubbing stutters:
 *   ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 22 -g 1 -keyint_min 1 \
 *     -x264-params "scenecut=0" -pix_fmt yuv420p -movflags +faststart -an out.mp4
 */

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function initCursorScrub(video, options = {}) {
  const opts = {
    axis: "horizontal",      // "horizontal" | "vertical"
    reverse: false,          // flip the mapping
    trackingArea: "window",  // "window" | "element" (element = the video's box)
    smoothing: 0.22,         // 0.02–1, higher = snappier
    idleSweep: true,         // on touch devices (no cursor), gently look left/right
    idleSweepSeconds: 7,     // duration of one full left→right→left sweep
    onReady: null,           // callback when scrubbing is enabled
    onProgress: null,        // callback(pos 0–1) every frame — e.g. to highlight labels
    ...options,
  };

  if (!video) return () => {};

  let ready = false;
  let seeking = false;
  let pointer = null;        // {x, y} normalized 0–1, null until first move
  let current = 0;           // smoothed time
  let raf = 0;
  let cancelled = false;

  const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.preload = "auto";

  const tryReady = () => {
    if (cancelled || ready || !warmedUp) return;
    if (video.readyState < 2) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    ready = true;
    video.classList.add("is-ready");
    opts.onReady && opts.onReady();
  };
  const onSeeking = () => (seeking = true);
  const onSeeked = () => { seeking = false; tryReady(); };

  video.addEventListener("seeking", onSeeking);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("loadeddata", tryReady);
  video.addEventListener("canplay", tryReady);

  // Warm up the decoder with a silent play/pause (allowed because muted).
  let warmedUp = false;
  const finishWarmup = () => {
    if (cancelled) return;
    video.pause();
    video.currentTime = 0;
    warmedUp = true;
    tryReady();
  };
  video.load();
  const p = video.play();
  if (p && typeof p.then === "function") p.then(finishWarmup).catch(finishWarmup);
  else finishWarmup();

  // Pointer tracking (clientX minus rect — robust to transforms and child elements).
  const onMove = (e) => {
    let x, y;
    if (opts.trackingArea === "window") {
      x = e.clientX / window.innerWidth;
      y = e.clientY / window.innerHeight;
    } else {
      const r = video.getBoundingClientRect();
      if (!r.width || !r.height) return;
      x = (e.clientX - r.left) / r.width;
      y = (e.clientY - r.top) / r.height;
    }
    pointer = { x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
  };
  const moveTarget = opts.trackingArea === "window" ? window : video;
  moveTarget.addEventListener("pointermove", onMove, { passive: true });

  const start = performance.now();

  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (!ready) return;
    const d = video.duration;
    if (!Number.isFinite(d) || d <= 0) return;

    let pos;
    if (pointer && hasHover) {
      pos = opts.axis === "horizontal" ? pointer.x : pointer.y;
      if (opts.reverse) pos = 1 - pos;
    } else if (opts.idleSweep && !hasHover && !reduceMotion) {
      // No cursor (phones/tablets): slow sine sweep left ↔ right.
      const t = (now - start) / 1000;
      pos = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / opts.idleSweepSeconds);
    } else {
      pos = 0.5; // desktop before the first mouse move: face forward
    }

    const target = pos * Math.max(0, d - 0.04);
    const s = clamp(opts.smoothing, 0.02, 1);
    let next = current + (target - current) * s;
    if (Math.abs(target - next) < 0.001) next = target;
    current = next;

    opts.onProgress && opts.onProgress(d > 0 ? current / d : 0);

    if (seeking) return;
    if (Math.abs(video.currentTime - next) > 0.008) video.currentTime = next;
  };
  raf = requestAnimationFrame(tick);

  // Cleanup function
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    moveTarget.removeEventListener("pointermove", onMove);
    video.removeEventListener("seeking", onSeeking);
    video.removeEventListener("seeked", onSeeked);
    video.removeEventListener("loadeddata", tryReady);
    video.removeEventListener("canplay", tryReady);
    video.pause();
  };
}

window.initCursorScrub = initCursorScrub;
