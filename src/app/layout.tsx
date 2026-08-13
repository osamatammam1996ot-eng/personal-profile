import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../styles/index.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { CmsProvider } from "../contexts/CmsContext";
import { ErrorBoundary } from "../components/layout/ErrorBoundary";

const cairo = Cairo({ subsets: ["latin", "arabic"], display: "swap" });

export const metadata: Metadata = {
  title: "Osama Tamam | UX/UI & User Experience Designer",
  description: "Portfolio of Osama Tamam, a UX/UI and User Experience Designer specializing in creating intuitive digital experiences and solving complex problems.",
  keywords: ["Osama Tamam", "UX UI Designer", "User Experience Designer", "User Interface Designer", "Product Designer", "Portfolio"],
  authors: [{ name: "Osama Tamam" }],
  creator: "Osama Tamam",
  metadataBase: new URL('https://os-tammam.cc'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://os-tammam.cc",
    title: "Osama Tamam | UX/UI & User Experience Designer",
    description: "Portfolio of Osama Tamam, a UX/UI and User Experience Designer specializing in creating intuitive digital experiences.",
    siteName: "Osama Tamam Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Osama Tamam | UX/UI & User Experience Designer",
    description: "Portfolio of Osama Tamam, a UX/UI and User Experience Designer specializing in creating intuitive digital experiences.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Osama Tamam",
    "jobTitle": "UX/UI Designer",
    "url": "https://os-tammam.cc",
    "sameAs": [
      "https://linkedin.com",
      "https://dribbble.com",
      "https://behance.net"
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${cairo.className} bg-background text-foreground antialiased`}>
        <ErrorBoundary>
          <LanguageProvider>
            <CmsProvider>
              {children}
            </CmsProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
