const fs = require("fs");
const path = require("path");

const config = require("../config.json");

const { addSimpleLinks } = require("./linkSimple");
const { replenishKeywords } = require("./keywordReplenish");

const keywordsPath = path.join(__dirname, "../keywords.json");
const usedPath = path.join(__dirname, "../used.json");
const outputDir = path.join(__dirname, "../");

function safeReadJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file));
  } catch {
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
<p>This is a clear guide about ${keyword}.</p>

<h2>How It Works</h2>
<p>${keyword} works through simple steps and consistent execution.</p>

<h2>Steps</h2>
<ul>
  <li>Understand basics</li>
  <li>Apply consistently</li>
  <li>Improve over time</li>
</ul>

<h2>Common Mistakes</h2>
<p>Most failures in ${keyword} come from inconsistency.</p>

<h2>Conclusion</h2>
<p>${keyword} improves with practice and repetition.</p>
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

function updateHub(pages) {
  const list = pages.map(p => {
    const name = p.replace(".html", "").replace(/-/g, " ");
    return `<li><a href="./${p}">${name}</a></li>`;
  }).join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Content Hub</title>
</head>
<body>

<h1>Content Hub</h1>

<ul>
${list}
</ul>

</body>
</html>
`;

  safeWrite(path.join(outputDir, "index.html"), html);
}

// LOAD DATA
let used = safeReadJSON(usedPath, []);
let keywords = safeReadJSON(keywordsPath, []);

// 🔁 SELF-REPLENISH KEYWORDS
replenishKeywords();
keywords = safeReadJSON(keywordsPath, []);

// SELECT BATCH
let batch = keywords
  .filter(k => !used.includes(k))
  .slice(0, config.pagesPerDay);

let pages = [];

// GENERATE PAGES
batch.forEach((kw) => {
  try {
    const slug = slugify(kw);
    const fileName = `${slug}.html`;

    let html = buildPage(kw, buildContent(kw));

    const filePath = path.join(outputDir, fileName);
    safeWrite(filePath, html);

    used.push(kw);
    pages.push(fileName);

  } catch (e) {
    console.log("PAGE ERROR:", kw, e.message);
  }
});

// SAVE USED KEYWORDS
safeWrite(usedPath, JSON.stringify(used, null, 2));

// APPLY INTERNAL LINKS (SECOND PASS)
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

// UPDATE HUB
updateHub(pages);

console.log("✅ FULL GENERATION COMPLETE (SELF-REPLENISH + HUB + LINKS)");
