const fs = require("fs");
const config = require("../config.json");

const keywords = require("../keywords.json");

const used = fs.existsSync("../used.json")
  ? JSON.parse(fs.readFileSync("../used.json"))
  : [];

const { buildContentV2 } = require("./contentEngineV2");
const { buildLinkGraph, injectLinks } = require("./linkEngineV2");
const { generateSitemap } = require("./sitemapEngineV2");

const intents = ["beginner", "problem", "comparison", "strategy", "case"];

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

function intent(i) {
  return intents[i % intents.length];
}

function getBatch() {
  return keywords
    .filter(k => !used.includes(k))
    .slice(0, config.pagesPerDay);
}

function buildPage(title, intentType, body) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="${title} guide">
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>

<h1>${title}</h1>
<p>${intentType.toUpperCase()} GUIDE</p>

${body}

<footer>
<p>Affiliate disclosure: This site may contain affiliate links.</p>
</footer>

</body>
</html>
`;
}

// RUN
const batch = getBatch();
const graph = buildLinkGraph(batch);

let pages = [];

batch.forEach((kw, i) => {
  const t = intent(i);
  const slug = slugify(kw);

  let html = buildPage(
    kw,
    t,
    buildContentV2(kw, t)
  );

  html = injectLinks(html, kw, graph);

  fs.writeFileSync(`../output/${slug}.html`, html);

  used.push(kw);
  pages.push(`${slug}.html`);
});

// update used keywords
fs.writeFileSync("../used.json", JSON.stringify(used, null, 2));

// generate sitemap
generateSitemap(pages, config.siteUrl);

console.log("STEP 4 COMPLETE: full system connected");
