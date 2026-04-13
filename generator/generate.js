const fs = require("fs");
const path = require("path");

const config = require("../config.json");
const keywords = require("../keywords.json");

const usedPath = path.join(__dirname, "../used.json");

const used = fs.existsSync(usedPath)
  ? JSON.parse(fs.readFileSync(usedPath))
  : [];

const intents = ["beginner", "problem", "comparison", "strategy", "case"];

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

function getBatch() {
  return keywords.filter(k => !used.includes(k)).slice(0, config.pagesPerDay);
}

function intent(i) {
  return intents[i % intents.length];
}

function buildContent(keyword, type) {
  return `
<h1>${keyword}</h1>

<h2>Introduction</h2>
<p>This guide explains ${keyword} in a simple and practical way.</p>

<h2>Core Idea</h2>
<p>${keyword} works based on real-world application, not theory.</p>

<h2>Steps</h2>
<ul>
  <li>Learn the basics</li>
  <li>Apply consistently</li>
  <li>Improve over time</li>
</ul>

<h2>Mistakes</h2>
<p>Most failures happen due to inconsistency or lack of strategy.</p>

<h2>FAQ</h2>
<p>Q: Is ${keyword} hard?<br>A: It depends on execution.</p>

<h2>Conclusion</h2>
<p>Success with ${keyword} comes from repetition and practice.</p>
`;
}

function buildPage(title, content, intentType) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="${title}">
</head>
<body>

<p><strong>${intentType.toUpperCase()}</strong></p>

${content}

<footer>
<p>Affiliate disclosure: This site may contain affiliate links.</p>
</footer>

</body>
</html>
`;
}

// RUN GENERATION
const batch = getBatch();

batch.forEach((kw, i) => {
  const t = intent(i);
  const slug = slugify(kw);

  const html = buildPage(
    kw,
    buildContent(kw, t),
    t
  );

  const outputPath = path.join(__dirname, `../${slug}.html`);

  fs.writeFileSync(outputPath, html);

  used.push(kw);
});

// save used keywords
fs.writeFileSync(usedPath, JSON.stringify(used, null, 2));

console.log("GitHub-ready build complete");
