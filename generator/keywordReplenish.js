const fs = require("fs");
const path = require("path");

const keywordsPath = path.join(__dirname, "../keywords.json");
const usedPath = path.join(__dirname, "../used.json");

// simple variations generator
function variations(word) {
  return [
    `best ${word}`,
    `${word} guide`,
    `${word} tips`,
    `how to start ${word}`,
    `${word} for beginners`,
    `${word} mistakes`,
    `${word} strategy`
  ];
}

function loadJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return fallback;
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function replenishKeywords() {
  const keywords = loadJSON(keywordsPath, []);
  const used = loadJSON(usedPath, []);

  let newKeywords = [...keywords];

  keywords.forEach(k => {
    const v = variations(k);
    v.forEach(item => {
      if (!newKeywords.includes(item)) {
        newKeywords.push(item);
      }
    });
  });

  // remove used keywords from pool
  newKeywords = newKeywords.filter(k => !used.includes(k));

  saveJSON(keywordsPath, newKeywords);

  console.log("🔁 KEYWORDS REPLENISHED:", newKeywords.length);
}

module.exports = { replenishKeywords };
