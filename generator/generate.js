const fs = require("fs");
const path = require("path");

const config = require("../config.json");
const keywords = require("../keywords.json");

const { addSimpleLinks } = require("./linkSimple");

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
<p>This is a simple, clear guide about ${keyword}.</p>

<h2>How It Works</h2>
<p>${keyword} is best understood through consistent practice and simple steps.</p>

<h2>Steps</h2>
<ul>
  <li>Learn the basics</li>
  <li>Apply consistently</li>
  <li>Improve over time</li>
</ul>

<h2>Common Mistakes</h2>
<p>Most people fail at ${keyword} due to inconsistency or lack of focus.</p>

<h2>Conclusion</h2>
<p>Success with ${keyword} comes from repetition and clarity.</p>
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

// LOAD USED KEYWORDS
let used = safeReadJSON(usedPath, []);

// SELECT BATCH
let batch = keywords.filter(k => !used.includes(k)).slice(0, config.pagesPerDay);

let pages = [];

// GENERATE PAGES
batch.forEach((kw) => {
  try {
    const slug = slugify(kw);
    const fileName = `${slug}.html`;

    let html = buildPage(kw, buildContent(kw));

    // save page first
    const filePath = path.join(outputDir, fileName);
    safeWrite(filePath, html);

    used.push(kw);
    pages.push(fileName);

  } catch (e) {
    console.log("PAGE ERROR:", kw, e.message);
  }
});

// ADD INTERNAL LINKS (SECOND PASS)
pages.forEach((file) => {
  try {
    const filePath = path.join(outputDir, file);
    let html = fs.readFileSync(filePath, "utf-8");

    html = addSimpleLinks(html, pages, file);

    safeWrite(filePath, html);
  } catch (e) {
    console.log("LINK ERROR:", file, e.message);
  }
});

// SAVE USED KEYWORDS
safeWrite(usedPath, JSON.stringify(used, null, 2));

console.log("✅ GENERATION COMPLETE (FULL SYSTEM)");
