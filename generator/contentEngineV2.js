function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const hooks = [
  "Most people misunderstand this topic completely.",
  "In real-world use, this behaves differently than expected.",
  "This is one of the most overlooked strategies today.",
  "The key issue is not what people think it is."
];

const transitions = [
  "Now here’s where it gets interesting:",
  "The important part is this:",
  "In practical terms:",
  "What actually matters is:"
];

function buildContentV2(keyword, intent) {
  return `
<h2>Introduction</h2>
<p>${rand(hooks)} The topic of <strong>${keyword}</strong> is more practical than theoretical.</p>

<h2>Core Explanation</h2>
<p>${keyword} works based on simple principles, but execution determines results.</p>

<h2>Deep Breakdown</h2>
<p>${rand(transitions)} success depends on consistency, testing, and structured improvement over time.</p>

<h2>Step-by-Step Guide</h2>
<ul>
  <li>Understand the fundamentals of ${keyword}</li>
  <li>Apply a structured approach</li>
  <li>Test and refine your process</li>
</ul>

<h2>Real Examples</h2>
<p>In practice, people use ${keyword} in different ways depending on goals and experience level.</p>

<h2>Common Mistakes</h2>
<p>Most failures come from inconsistency, poor research, or unrealistic expectations.</p>

<h2>Strategy Section</h2>
<p>To succeed with ${keyword}, focus on long-term improvement instead of quick results.</p>

<h2>FAQ</h2>
<p><strong>Q:</strong> Is ${keyword} hard?<br>
<strong>A:</strong> It depends on how consistently you apply it.</p>

<h2>Conclusion</h2>
<p>Mastery of ${keyword} comes from repetition and refinement, not shortcuts.</p>
`;
}

module.exports = { buildContentV2 };
