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

import type { Post } from "./medium.js";

export function renderBox(username: string, followers: number | null, posts: Post[]): string {
  const head = `📚 Medium — @${username}`;
  const follow = followers !== null ? `${followers} followers` : "followers: —";

  const lines = posts.map((p, i) => {
    const date = new Date(p.publishedAt).toISOString().slice(0, 10);
    return `${i + 1}. [${p.title}](${p.url}) — ${date}`;
  });

  return [
    "```text",
    head,
    follow,
    "",
    ...lines,
    "```"
  ].join("\n");
}
