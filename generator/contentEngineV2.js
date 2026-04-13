const fs = require("fs");

function slugify(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

function buildLinkGraph(batch) {
  const graph = {};

  for (let i = 0; i < batch.length; i++) {
    const current = batch[i];

    graph[current] = {
      prev: batch[i - 1] || null,
      next: batch[i + 1] || null
    };
  }

  return graph;
}

function injectLinks(html, keyword, graph) {
  const node = graph[keyword];

  let links = `<section><h3>Related</h3><ul>`;

  if (node.prev) {
    links += `<li><a href="./${slugify(node.prev)}.html">${node.prev}</a></li>`;
  }

  if (node.next) {
    links += `<li><a href="./${slugify(node.next)}.html">${node.next}</a></li>`;
  }

  links += `</ul></section>`;

  return html.replace("</body>", links + "</body>");
}

module.exports = { buildLinkGraph, injectLinks };
