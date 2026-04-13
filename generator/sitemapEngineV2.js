const fs = require("fs");

function generateSitemap(pages, siteUrl) {
  const today = new Date().toISOString();

  let urls = pages.map(page => {
    return `
  <url>
    <loc>${siteUrl}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync("./sitemap.xml", sitemap);
}

module.exports = { generateSitemap };
