import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../styles/index.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { CmsProvider } from "../contexts/CmsContext";
import { ErrorBoundary } from "../components/layout/ErrorBoundary";

const cairo = Cairo({ subsets: ["latin", "arabic"], display: "swap" });

import { siteConfig } from "../config/seo";
import { CyberGlitch } from "../components/shared/CyberGlitch";

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  metadataBase: new URL(siteConfig.productionOrigin),
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.productionOrigin,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
  },
  verification: {
    google: siteConfig.verification.google,
    other: {
      "msvalidate.01": siteConfig.verification.bing,
    }
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.productionOrigin}/#website`,
    "url": siteConfig.productionOrigin,
    "name": siteConfig.siteName,
    "description": siteConfig.defaultDescription,
    "inLanguage": "en",
    "creator": {
      "@id": `${siteConfig.productionOrigin}/#osama-tammam`
    }
  };

  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.productionOrigin}/#osama-tammam`,
    "name": siteConfig.name,
    "url": siteConfig.productionOrigin,
    "jobTitle": siteConfig.primaryTitle,
    "description": siteConfig.defaultDescription,
    "sameAs": Object.values(siteConfig.socialProfiles).filter(Boolean),
    "knowsAbout": [
      "User experience design",
      "User interface design",
      "UX/UI design",
      "Product design",
      "Mobile application design",
      "Web interface design",
      "Design systems"
    ]
  };

  const jsonLdProfilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.productionOrigin}/#webpage`,
    "url": siteConfig.productionOrigin,
    "mainEntity": {
      "@id": `${siteConfig.productionOrigin}/#osama-tammam`
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLdWebsite, jsonLdPerson, jsonLdProfilePage]) }}
        />
      </head>
      <body className={`${cairo.className} bg-background text-foreground antialiased`}>
        <ErrorBoundary>
          <LanguageProvider>
            <CmsProvider>
              {children}
              <CyberGlitch />
            </CmsProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
