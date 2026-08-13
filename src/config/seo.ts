export const siteConfig = {
  name: "Osama Tammam",
  primaryTitle: "UX/UI Designer",
  supportingTitles: [
    "Product Designer",
    "User Experience Designer",
    "User Interface Designer",
  ],
  siteName: "Osama Tammam Portfolio",
  productionOrigin: "https://os-tammam.cc",
  defaultTitle: "Osama Tammam | UX/UI & Product Designer",
  defaultDescription: "Explore the portfolio and selected work of Osama Tammam, a UX/UI and product designer focused on user experience and user interface design.",
  defaultOgImage: "https://os-tammam.cc/og-image.jpg", // Fallback, assume existing or omit if missing
  locale: "en_US",
  contactUrl: "https://os-tammam.cc/#contact",
  socialProfiles: {
    linkedin: "https://linkedin.com",
    dribbble: "https://dribbble.com",
    behance: "https://behance.net"
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
  }
};
