const fs = require("fs");
const config = require("../config.json");
const keywords = require("../keywords.json");
const used = fs.existsSync("../used.json")
  ? JSON.parse(fs.readFileSync("../used.json"))
  : [];

const { buildContentV2 } = require("./contentEngineV2");

const intents = ["beginner", "problem", "comparison", "strategy", "case"];

function getBatch() {
  return keywords
    .filter(k => !used.includes(k))
    .slice(0, config.pagesPerDay);
}

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-");
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

const batch = getBatch();

batch.forEach((kw, i) => {
  const t = intent(i);
  const slug = slugify(kw);

  const html = buildPage(
    kw,
    t,
    buildContentV2(kw, t)
  );

  fs.writeFileSync(`../output/${slug}.html`, html);

  used.push(kw);
});

fs.writeFileSync("../used.json", JSON.stringify(used, null, 2));

console.log("STEP 1 COMPLETE: v2 content engine running");
