export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*?*"],
      },
    ],
    sitemap: "https://humanbiomedical.com/sitemap.xml",
  };
}