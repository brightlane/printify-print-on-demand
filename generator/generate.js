const fs = require("fs");
const path = require("path");

// Prevent runaway builds
const MAX_ITEMS = 50;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example input (replace with your real data source)
function getItems() {
  return Array.from({ length: 200 }, (_, i) => ({
    keyword: `seo keyword ${i + 1}`
  }));
}

async function generate(item) {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = item.keyword.replace(/\s+/g, "-") + ".txt";
  const filePath = path.join(outputDir, fileName);

  const content = `
TITLE: ${item.keyword}
DESCRIPTION: Generated SEO content for ${item.keyword}
`;

  fs.writeFileSync(filePath, content.trim());
}

// MAIN PIPELINE (SAFE)
async function run() {
  const items = getItems().slice(0, MAX_ITEMS);

  console.log(`Processing ${items.length} items...`);

  for (let i = 0; i < items.length; i++) {
    try {
      await generate(items[i]);
      console.log(`✔ Generated ${i + 1}/${items.length}`);

      // prevent GitHub Actions overload
      await sleep(200);

    } catch (err) {
      console.error(`✖ Failed:`, items[i], err.message);
    }
  }

  console.log("DONE: generation complete");
}

run();
