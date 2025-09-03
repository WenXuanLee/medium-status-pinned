export function renderMarkdown(posts: { title: string; url: string; publishedAt: string }[]) {
  return posts.map(p => {
    const d = new Date(p.publishedAt).toISOString().slice(0, 10);
    return `- [${p.title}](${p.url}) — ${d}`;
  }).join("\n");
}

export function injectContent(currentReadme: string, content: string) {
  const START = "<!-- MEDIUM:START -->";
  const END = "<!-- MEDIUM:END -->";
  const block = `${START}\n${content}\n${END}`;
  if (currentReadme.includes(START) && currentReadme.includes(END)) {
    return currentReadme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
  }
  return `${currentReadme.trim()}\n\n## Latest from Medium\n${block}\n`;
}
