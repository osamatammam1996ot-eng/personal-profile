/**
 * One definition of "something that does an action when clicked", shared by
 * the click glitch (which only plays on empty space) and the custom cursor.
 *
 * Native controls and ARIA widgets are detected automatically. Anything else
 * that reacts to clicks, such as a hot spot inside a WebGL canvas, marks
 * itself with the `data-clickable` attribute while the pointer is over it.
 */
export const CLICKABLE_ATTR = 'data-clickable';

const CLICKABLE_SELECTOR = [
  'a[href]', 'button', 'input', 'textarea', 'select', 'label', 'summary',
  '[role="button"]', '[role="link"]', '[role="tab"]', '[role="menuitem"]',
  '[role="option"]', '[role="switch"]', '[role="checkbox"]', '[role="radio"]',
  '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])',
  `[${CLICKABLE_ATTR}]`,
].join(', ');

/** True when the element, or one of its ancestors, does something on click. */
export function isClickable(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(CLICKABLE_SELECTOR) !== null;
}
