import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/seo';
import Home from '@/app/page';
import { getPublishedContent } from '@/lib/published-content';
import { publishedProjects } from '@/lib/cms-projects';

// A direct link to one project: the home page with that project's gallery already open.
// Projects are added and reordered in the admin, so the page reads the live content.

type Props = { params: Promise<{ id: string }> };

async function findProject(params: Props['params']) {
  const { id } = await params;
  const projects = publishedProjects(await getPublishedContent());
  return projects.find((p) => String(p.id) === id) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await findProject(params);
  if (!project) return { title: 'Project not found' };

  const title = `${project.name} | UX Case Study | Osama Tammam`;
  const description = project.description || siteConfig.defaultDescription;
  const url = `${siteConfig.productionOrigin}/case-study/${project.id}`;
  const images = project.image ? [{ url: project.image, alt: `${project.name} case study` }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images: project.image ? [project.image] : undefined },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const project = await findProject(params);
  if (!project) notFound();

  const jsonLdCreativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description || siteConfig.defaultDescription,
    url: `${siteConfig.productionOrigin}/case-study/${project.id}`,
    image: project.image || siteConfig.defaultOgImage,
    creator: { '@id': `${siteConfig.productionOrigin}/#osama-tammam` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCreativeWork) }} />
      <Home initialCaseStudy={{ id: project.id, title: project.name }} />
    </>
  );
}
