const fs = require("fs");
const path = require("path");

const config = require("../config.json");
const keywords = require("../keywords.json");

const usedPath = path.join(__dirname, "../used.json");
const used = fs.existsSync(usedPath)
  ? JSON.parse(fs.readFileSync(usedPath))
  : [];

const { buildContentV2 } = require("./contentEngineV2");
const { buildLinkGraph, injectLinks } = require("./linkEngineV2");

const intents = ["beginner", "problem", "comparison", "strategy", "case"];

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

function getBatch() {
  return keywords
    .filter(k => !used.includes(k))
    .slice(0, config.pagesPerDay);
}

function intent(i) {
  return intents[i % intents.length];
}

function buildPage(title, intentType, body) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="${title}">
</head>
<body>

<h1>${title}</h1>
<p>${intentType.toUpperCase()}</p>

${body}

<footer>
<p>Affiliate disclosure: This site may contain affiliate links.</p>
</footer>

</body>
</html>
`;
}

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

  fs.writeFileSync(path.join(__dirname, `../${slug}.html`), html);

  used.push(kw);
  pages.push(`${slug}.html`);
});

fs.writeFileSync(usedPath, JSON.stringify(used, null, 2));

console.log("STEP 5 COMPLETE");
