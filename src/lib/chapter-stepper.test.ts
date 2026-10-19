import { describe, expect, it } from 'vitest';
import { LAST_CHAPTER, decideStep, isNewWheelGesture, isSpeedUp, type WheelSample } from './chapter-stepper';

// A wheel event in the middle of a steady stream, long after the last transition
const wheel = (over: Partial<WheelSample> = {}): WheelSample => ({
  now: 5000,
  abs: 10,
  lastWheel: 4990,
  lastAbs: 10,
  recentAbs: [10, 10, 10],
  lastStepAt: 0,
  pointerMoved: 0,
  ...over,
});

const idle = { chapter: 1, aligned: true, animating: false, gestureUsed: false };

describe('isNewWheelGesture', () => {
  it('treats a steady stream of events as one gesture', () => {
    expect(isNewWheelGesture(wheel())).toBe(false);
    expect(isNewWheelGesture(wheel({ lastWheel: 4850 }))).toBe(false); // exactly the 150ms gap
  });

  it('starts a new gesture after a pause in the events', () => {
    expect(isNewWheelGesture(wheel({ lastWheel: 4849 }))).toBe(true);
  });

  it('starts a new gesture once the cursor has moved', () => {
    expect(isNewWheelGesture(wheel({ pointerMoved: 4 }))).toBe(false);
    expect(isNewWheelGesture(wheel({ pointerMoved: 5 }))).toBe(true);
  });

  it('starts a new gesture when the stream speeds up', () => {
    expect(isNewWheelGesture(wheel({ recentAbs: [10, 8, 6], lastAbs: 6, abs: 20 }))).toBe(true);
  });
});

describe('isSpeedUp', () => {
  it('ignores momentum, which only slows down', () => {
    expect(isSpeedUp(wheel({ recentAbs: [40, 30, 22], lastAbs: 22, abs: 16 }))).toBe(false);
  });

  it('ignores small wobble inside one swipe', () => {
    expect(isSpeedUp(wheel({ recentAbs: [20, 18, 16], lastAbs: 16, abs: 19 }))).toBe(false);
  });

  it('spots a new swipe that arrives before the momentum stops', () => {
    expect(isSpeedUp(wheel({ recentAbs: [10, 8, 6], lastAbs: 6, abs: 20 }))).toBe(true);
  });

  it('needs a few samples to compare against', () => {
    expect(isSpeedUp(wheel({ recentAbs: [8, 6], lastAbs: 6, abs: 20 }))).toBe(false);
  });

  it('ignores near-zero deltas at the tail of momentum', () => {
    expect(isSpeedUp(wheel({ recentAbs: [1, 1, 1], lastAbs: 1, abs: 3 }))).toBe(false);
  });

  it('does not fire while the last transition is still playing', () => {
    const fast = { recentAbs: [10, 8, 6], lastAbs: 6, abs: 20 };
    expect(isSpeedUp(wheel({ ...fast, lastStepAt: 4000 }))).toBe(false); // 1000ms ago
    expect(isSpeedUp(wheel({ ...fast, lastStepAt: 3899 }))).toBe(true);  // 1101ms ago
  });
});

describe('decideStep', () => {
  it('moves one chapter on a new gesture', () => {
    expect(decideStep(idle, 1, true, 1)).toEqual({ type: 'go', chapter: 2 });
    expect(decideStep(idle, -1, true, 1)).toEqual({ type: 'go', chapter: 0 });
  });

  it('moves at most one chapter per gesture', () => {
    expect(decideStep({ ...idle, gestureUsed: true }, 1, false, 1)).toEqual({ type: 'hold' });
  });

  it('queues a new gesture made during a transition', () => {
    expect(decideStep({ ...idle, animating: true }, 1, true, 1)).toEqual({ type: 'queue' });
    // ...but only one: the gesture that queued it can't queue another
    expect(decideStep({ ...idle, animating: true, gestureUsed: true }, 1, false, 1)).toEqual({ type: 'hold' });
  });

  it('leaves the section past either end', () => {
    expect(decideStep({ ...idle, chapter: LAST_CHAPTER }, 1, true, LAST_CHAPTER)).toEqual({ type: 'leave' });
    expect(decideStep({ ...idle, chapter: 0 }, -1, true, 0)).toEqual({ type: 'leave' });
  });

  it('does not leave on the gesture that just moved, or mid-transition', () => {
    expect(decideStep({ ...idle, chapter: LAST_CHAPTER, gestureUsed: true }, 1, false, LAST_CHAPTER)).toEqual({ type: 'hold' });
    expect(decideStep({ ...idle, chapter: LAST_CHAPTER, animating: true }, 1, true, LAST_CHAPTER)).toEqual({ type: 'hold' });
  });

  it('settles on the chapter it entered at before stepping', () => {
    const arriving = { ...idle, aligned: false };
    expect(decideStep(arriving, 1, false, 1)).toEqual({ type: 'settle', chapter: 0 }); // from above: Intro
    expect(decideStep(arriving, -1, false, 2)).toEqual({ type: 'settle', chapter: LAST_CHAPTER }); // from below: 03
    expect(decideStep(arriving, 1, true, 2)).toEqual({ type: 'settle', chapter: 2 }); // fresh: where it is
  });
});
