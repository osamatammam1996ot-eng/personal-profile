import { getCmsDataAction } from '@/app/actions/cms';
import { normalizeCmsData } from './cms-normalize';
import type { CmsData } from '@/types/cms';

/** The live site content, for server-rendered pages (project links, sitemap). */
export async function getPublishedContent(): Promise<CmsData> {
  const response = await getCmsDataAction();
  return normalizeCmsData('data' in response ? response.data : null);
}
