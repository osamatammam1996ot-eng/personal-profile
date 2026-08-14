import { Metadata } from 'next';
import { DEFAULT_CMS_DATA } from '@/types/cms';
import { siteConfig } from '@/config/seo';
import Home from '@/app/page';

export async function generateStaticParams() {
  return DEFAULT_CMS_DATA.caseStudies
    .filter((study: any) => study.visible !== false)
    .map((study: any) => ({
      id: study.id.toString(),
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const caseStudy = DEFAULT_CMS_DATA.caseStudies.find((s: any) => s.id.toString() === params.id);
  
  if (!caseStudy) {
    return { title: 'Case Study Not Found' };
  }

  const title = `${caseStudy.title.en} UX Case Study | Osama Tammam`;
  const desc = siteConfig.defaultDescription;
  const url = `${siteConfig.productionOrigin}/case-study/${params.id}`;
  const firstImage = caseStudy.media?.find((m: any) => m.type === 'image')?.url;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      images: firstImage ? [
        {
          url: firstImage,
          alt: `${caseStudy.title.en} Case Study`,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const caseStudy = DEFAULT_CMS_DATA.caseStudies.find((s: any) => s.id.toString() === params.id);

  if (!caseStudy) {
    return null;
  }
  
  const firstImage = caseStudy.media?.find((m: any) => m.type === 'image')?.url;

  const jsonLdCreativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": caseStudy.title.en,
    "description": siteConfig.defaultDescription,
    "url": `${siteConfig.productionOrigin}/case-study/${params.id}`,
    "image": firstImage || siteConfig.defaultOgImage,
    "creator": {
      "@id": `${siteConfig.productionOrigin}/#osama-tammam`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCreativeWork) }}
      />
      <Home initialCaseStudy={{ id: caseStudy.id, title: caseStudy.title.en }} />
    </>
  );
}
