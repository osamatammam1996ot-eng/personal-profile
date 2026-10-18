import type { CmsData } from '../types/cms';
import { DEFAULT_CMS_DATA } from '../types/cms';

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Deep-merge helper: ensures every key from `base` exists in the result,
// filling in missing fields from the defaults.
function mergeDeep<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) {
    return clone(base);
  }

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? clone(override) : clone(base)) as T;
  }

  if (typeof base === 'object' && base !== null) {
    const result: Record<string, unknown> = {};
    const baseObj = base as Record<string, unknown>;
    const overrideObj = (typeof override === 'object' ? override : {}) as Record<string, unknown>;

    for (const key of Object.keys(baseObj)) {
      result[key] = mergeDeep(baseObj[key], overrideObj[key]);
    }
    // Keep saved fields the defaults don't list (optional settings such as
    // contact.showMeetingAction); without this they were silently dropped.
    for (const key of Object.keys(overrideObj)) {
      if (!(key in baseObj) && overrideObj[key] !== undefined) {
        result[key] = clone(overrideObj[key]);
      }
    }

    return result as T;
  }

  return (override as T) ?? base;
}

/** Fills any field missing from saved CMS data with its default and applies data migrations. */
export function normalizeCmsData(input: unknown): CmsData {
  const data = mergeDeep(DEFAULT_CMS_DATA, input);

  // Migration: ensure logoMarquee is in sectionOrder
  if (data.sectionOrder && !data.sectionOrder.includes('logoMarquee')) {
    const heroIdx = data.sectionOrder.indexOf('hero');
    if (heroIdx !== -1) {
      data.sectionOrder.splice(heroIdx + 1, 0, 'logoMarquee');
    } else {
      data.sectionOrder.splice(1, 0, 'logoMarquee');
    }
  }

  return data;
}
