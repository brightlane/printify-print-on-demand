function buildLinkGraph(keywords) {
  const graph = {};

  for (let i = 0; i < keywords.length; i++) {
    const current = keywords[i];

    const prev = keywords[i - 1] || null;
    const next = keywords[i + 1] || null;

    graph[current] = {
      parent: "hub.html",
      prev,
      next
    };
  }

  return graph;
}

function injectLinks(html, keyword, graph) {
  const node = graph[keyword];

  let links = `<section><h3>Related Reading</h3><ul>`;

  if (node.prev) {
    links += `<li><a href="${slug(node.prev)}.html">${node.prev}</a></li>`;
  }

  links += `<li><a href="/hub.html">Main Hub</a></li>`;

  if (node.next) {
    links += `<li><a href="${slug(node.next)}.html">${node.next}</a></li>`;
  }

  links += `</ul></section>`;

  return html.replace("</body>", links + "</body>");
}

function slug(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

module.exports = { buildLinkGraph, injectLinks };
