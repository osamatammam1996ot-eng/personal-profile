import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { CmsProvider } from "../contexts/CmsContext";
import { ErrorBoundary } from "../components/layout/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal Portfolio & Case Studies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
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
