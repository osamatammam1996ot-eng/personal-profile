import { useCms } from '../contexts/CmsContext';

/** Client logos marked visible in the CMS, in CMS order. */
export function useClientLogos() {
  const { cmsData } = useCms();
  return cmsData.logoMarquee.filter((logo) => logo.visible);
}
