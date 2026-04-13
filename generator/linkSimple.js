function addSimpleLinks(html, pages, currentPage) {
  const others = pages.filter(p => p !== currentPage).slice(0, 3);

  const links = others.map(p => {
    const name = p.replace(".html", "").replace(/-/g, " ");
    return `<li><a href="./${p}">${name}</a></li>`;
  }).join("\n");

  const block = `
<section>
  <h3>Related Pages</h3>
  <ul>
    ${links}
  </ul>
</section>
`;

  return html.replace("</body>", block + "</body>");
}

module.exports = { addSimpleLinks };
