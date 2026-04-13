const fs = require("fs");
const path = require("path");

const config = require("../config.json");
const keywords = require("../keywords.json");

const usedPath = path.join(__dirname, "../used.json");
const outputDir = path.join(__dirname, "../");

function safeReadJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file));
  } catch (e) {
    return fallback;
  }
}

function safeWrite(file, data) {
  try {
    fs.writeFileSync(file, data);
  } catch (e) {
    console.log("WRITE ERROR:", e.message);
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

function buildContent(keyword) {
  return `
<h1>${keyword}</h1>

<h2>Overview</h2>
<p>This is a simple guide about ${keyword}.</p>

<h2>Steps</h2>
<ul>
  <li>Understand basics</li>
  <li>Apply consistently</li>
  <li>Improve over time</li>
</ul>

<h2>Conclusion</h2>
<p>${keyword} works best with consistency.</p>
`;
}

function buildPage(title, body) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="${title}">
</head>
<body>

${body}

<footer>
<p>Affiliate disclosure: this site may contain affiliate links.</p>
</footer>

</body>
</html>
`;
}

// LOAD USED
let used = safeReadJSON(usedPath, []);

// PICK KEYWORDS
let batch = keywords.filter(k => !used.includes(k)).slice(0, config.pagesPerDay);

let pages = [];

batch.forEach((kw) => {
  try {
    const slug = slugify(kw);
    const html = buildPage(kw, buildContent(kw));

    const filePath = path.join(outputDir, `${slug}.html`);

    safeWrite(filePath, html);

    used.push(kw);
    pages.push(`${slug}.html`);
  } catch (e) {
    console.log("PAGE ERROR:", kw, e.message);
  }
});

// SAVE USED
safeWrite(usedPath, JSON.stringify(used, null, 2));

console.log("✅ GENERATION COMPLETE - SAFE MODE");
