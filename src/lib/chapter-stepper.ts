import gsap from 'gsap';

export const LAST_CHAPTER = 3;
const STEP_SECONDS = 0.9;
// A trackpad flick keeps firing wheel events for a second or more. Events closer together than
// this belong to the same gesture, and one gesture may move at most one chapter.
const GESTURE_GAP_MS = 150;
// Moving the cursor more than this between wheel events starts a new gesture: you can't move the
// pointer and scroll in one motion, and on a touchpad touching it to move also stops the momentum
const POINTER_MOVE_PX = 4;
const SWIPE_PX = 30;

export interface WheelSample {
  now: number;
  abs: number;          // |deltaY| of this event
  lastWheel: number;    // time of the previous wheel event
  lastAbs: number;      // |deltaY| of the previous wheel event
  recentAbs: number[];  // last few wheel speeds of the current gesture
  lastStepAt: number;   // when the last chapter transition started
  pointerMoved: number; // cursor travel since the previous wheel event
}

/**
 * Momentum (the scroll that keeps going after your fingers lift) is a smooth, steady slowdown.
 * Once the transition has finished, any real speed-up in the stream is a new swipe even though
 * the events never paused. Small wobble inside one swipe stays under the 1.5x-of-recent-low bar.
 */
export function isSpeedUp({ now, abs, lastAbs, recentAbs, lastStepAt }: WheelSample) {
  return recentAbs.length >= 3
    && abs >= 4
    && abs > lastAbs * 1.15
    && abs > Math.min(...recentAbs) * 1.5
    && now - lastStepAt > STEP_SECONDS * 1000 + 100;
}

/** Whether this wheel event starts a new gesture rather than continuing the current one */
export function isNewWheelGesture(w: WheelSample) {
  return w.now - w.lastWheel > GESTURE_GAP_MS || w.pointerMoved > POINTER_MOVE_PX || isSpeedUp(w);
}

export type StepAction =
  | { type: 'settle'; chapter: number } // first input after arriving: land on the chapter entered at
  | { type: 'go'; chapter: number }     // play one transition
  | { type: 'queue' }                   // play it right after the transition that's running
  | { type: 'hold' }                    // swallow the input and stay on this chapter
  | { type: 'leave' };                  // hand the gesture back to the page, out of the section

/** What one scroll step in `dir` (1 down, -1 up) does, given the stepper's state */
export function decideStep(
  s: { chapter: number; aligned: boolean; animating: boolean; gestureUsed: boolean },
  dir: number,
  fresh: boolean,
  nearest: number,
): StepAction {
  if (!s.aligned) {
    // First input after arriving: settle on the chapter we entered at (Intro from above,
    // the last one from below) and use up the rest of this gesture, so the flick that brought
    // you here can't also skip ahead or carry you straight through
    return { type: 'settle', chapter: fresh ? nearest : dir < 0 ? LAST_CHAPTER : 0 };
  }
  const next = s.chapter + dir;
  if (next < 0 || next > LAST_CHAPTER) {
    // Leaving the section: only on a fresh gesture, after the last transition has finished
    return s.animating || s.gestureUsed ? { type: 'hold' } : { type: 'leave' };
  }
  if (s.gestureUsed) return { type: 'hold' };
  // A new gesture while a transition is still playing isn't lost: it runs right after
  if (s.animating) return { type: 'queue' };
  return { type: 'go', chapter: next };
}

/**
 * One gesture = one chapter. While the sticky stage fills the screen, wheel, swipe and keyboard
 * scrolling are taken over: each gesture plays exactly one chapter transition however strong it is,
 * and further input is ignored until that transition finishes and the gesture has ended.
 * Scrolling past the first or last chapter hands control back to the page, so it never traps you.
 * The window scroll position is kept on the chapter, so the scrollbar and leaving stay natural.
 *
 * Chapter k sits at time k of `tl`. Returns the teardown.
 */
export function setupChapterStepper(
  container: HTMLElement,
  tl: gsap.core.Timeline,
  onChapter: (k: number) => void,
  goToRef: { current: ((k: number) => void) | null },
) {
  let chapter = 0;
  let animating = false;
  let aligned = false;     // snapped to a chapter since arriving on the stage
  let gestureUsed = false; // the current gesture already moved a chapter
  let lastWheel = 0;
  let selfScroll = false;
  let touchStartY = 0;
  let touchStartedEngaged = false;
  let leaving = 0;         // direction this gesture is leaving the section in; it keeps going natively
  let touchActiveUntil = 0; // a swipe and its momentum are still moving the page until then
  let lastScrollY = window.scrollY;
  let queued = 0;          // one new gesture made during a transition plays right after it
  let lastStepAt = 0;
  let lastAbs = 0;
  const recentAbs: number[] = []; // last few wheel speeds, to tell momentum from a new swipe
  let pointerMoved = 0;    // cursor travel since the last wheel event
  let lastPointer: { x: number; y: number } | null = null;
  let lockTimer: ReturnType<typeof setTimeout> | undefined;

  const span = () => container.offsetHeight - window.innerHeight;
  const engaged = () => {
    // 3px of slack: at display zoom levels scroll positions land on fractional pixels
    const r = container.getBoundingClientRect();
    return r.top <= 3 && r.bottom >= window.innerHeight - 3;
  };
  const nearest = () => {
    const progress = Math.min(1, Math.max(0, -container.getBoundingClientRect().top / Math.max(1, span())));
    return Math.round(progress * LAST_CHAPTER);
  };
  const chapterY = (k: number) => container.getBoundingClientRect().top + window.scrollY + span() * (k / LAST_CHAPTER);
  const scrollToChapter = (k: number) => {
    selfScroll = true;
    window.scrollTo({ top: chapterY(k), behavior: 'instant' as ScrollBehavior });
    // A timer, not rAF: if frames are paused the flag would otherwise stick and stop syncing
    setTimeout(() => { selfScroll = false; }, 120);
  };

  const goTo = (k: number, scroll = true) => {
    k = Math.max(0, Math.min(LAST_CHAPTER, k));
    const steps = Math.abs(k - tl.time());
    chapter = k;
    onChapter(k);
    if (scroll) scrollToChapter(k);
    if (steps < 0.001) return;
    animating = true;
    lastStepAt = performance.now();
    const duration = STEP_SECONDS * Math.min(steps, 1.5);
    gsap.to(tl, { time: k, duration, ease: 'none', overwrite: true, onComplete: finish });
    // Backup release: if the browser pauses animation frames mid-transition (background tab,
    // battery saver) the tween stalls, and input must not stay locked until frames resume
    clearTimeout(lockTimer);
    lockTimer = setTimeout(finish, duration * 1000 + 150);
  };

  // Transition done: unlock, and play the one step that was asked for while it ran
  function finish() {
    if (!animating) return;
    animating = false;
    clearTimeout(lockTimer);
    const dir = queued;
    queued = 0;
    const next = chapter + dir;
    if (dir && next >= 0 && next <= LAST_CHAPTER && engaged()) goTo(next);
  }
  goToRef.current = (k) => { aligned = true; queued = 0; goTo(k); };

  const step = (dir: number, e: Event, fresh: boolean) => {
    if (!engaged()) { aligned = false; leaving = 0; return; }
    if (leaving === dir) return; // this gesture already chose to leave: let the page carry on
    if (!aligned && fresh && Math.abs(window.scrollY - chapterY(nearest())) < 4) {
      // Arrived some other way (scrollbar, link, reload) and resting on a chapter: a new
      // gesture or key press steps normally instead of being swallowed
      aligned = true;
      chapter = nearest();
    }
    const action = decideStep({ chapter, aligned, animating, gestureUsed }, dir, fresh, nearest());
    if (action.type === 'leave') { leaving = dir; return; }
    e.preventDefault();
    if (action.type === 'hold') return;
    aligned = true;
    gestureUsed = true;
    if (action.type === 'queue') queued = dir;
    else goTo(action.chapter);
  };

  const onWheel = (e: WheelEvent) => {
    const now = performance.now();
    const abs = Math.abs(e.deltaY);
    const fresh = isNewWheelGesture({ now, abs, lastWheel, lastAbs, recentAbs, lastStepAt, pointerMoved });
    if (fresh) { gestureUsed = false; leaving = 0; recentAbs.length = 0; }
    recentAbs.push(abs);
    if (recentAbs.length > 5) recentAbs.shift();
    pointerMoved = 0;
    lastAbs = abs;
    lastWheel = now;
    if (abs < 1) return;
    step(Math.sign(e.deltaY), e, fresh);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0]?.clientY ?? 0;
    touchStartedEngaged = engaged();
    gestureUsed = false;
    leaving = 0;
  };
  const onPointerMove = (e: MouseEvent) => {
    if (lastPointer) pointerMoved += Math.hypot(e.clientX - lastPointer.x, e.clientY - lastPointer.y);
    lastPointer = { x: e.clientX, y: e.clientY };
  };

  const onTouchEnd = () => { touchActiveUntil = performance.now() + 1000; }; // momentum keeps going
  const onTouchMove = (e: TouchEvent) => {
    touchActiveUntil = performance.now() + 1000;
    if (!engaged()) { aligned = false; leaving = 0; return; }
    const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY); // > 0: swiping up = scrolling down
    if (leaving && leaving === (dy < 0 ? -1 : 1)) return;
    if (aligned && Math.abs(dy) < SWIPE_PX) {
      // Under the swipe threshold: hold the stage still, unless this swipe leads out of the section
      const next = chapter + (dy < 0 ? -1 : 1);
      if (next >= 0 && next <= LAST_CHAPTER) e.preventDefault();
      return;
    }
    step(dy < 0 ? -1 : 1, e, touchStartedEngaged);
  };

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName))) return;
    let dir = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
    if (!dir || e.repeat) return;
    gestureUsed = false;
    leaving = 0;
    step(dir, e, true);
  };

  const onScroll = () => {
    const y = window.scrollY;
    const movingUp = y < lastScrollY;
    lastScrollY = y;
    if (!engaged()) { aligned = false; leaving = 0; return; }
    const now = performance.now();
    const userScrolling = now - lastWheel < GESTURE_GAP_MS || now < touchActiveUntil;
    if (leaving) {
      if (userScrolling) return; // a gesture that chose to leave scrolls freely
      leaving = 0;               // ...but only while that gesture lasts
    }

    // A wheel or swipe gesture that began outside the section can't be cancelled once it gets
    // here (browsers only allow cancelling a gesture from its first event), so it would carry
    // the page straight through. Catch it from the scroll position instead: settle on the chapter
    // it entered at, then hold the stage there until that gesture's momentum dies out.
    if (userScrolling) {
      if (!aligned) {
        aligned = true;
        gestureUsed = true;
        goTo(movingUp ? LAST_CHAPTER : 0);
      } else if (Math.abs(y - chapterY(chapter)) > 1) {
        scrollToChapter(chapter);
      }
      return;
    }

    // Scrollbar drags and anchor links: follow the scroll position
    if (selfScroll || animating) return;
    const k = nearest();
    if (k !== chapter) goTo(k, false);
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Landing mid-section (reload, back button): start on that chapter
  if (engaged()) { chapter = nearest(); tl.time(chapter); onChapter(chapter); }

  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('scroll', onScroll);
    gsap.killTweensOf(tl);
    clearTimeout(lockTimer);
    goToRef.current = null;
  };
}
