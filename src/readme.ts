import type { Post } from "./medium.js";

export function renderBox(username: string, followers: number | null, posts: Post[]): string {
  const head = `📚 Medium — @${username}`;
  const follow = followers !== null ? `${followers} followers` : "followers: —";

  const lines = posts.map((p, i) => {
    const date = new Date(p.publishedAt).toISOString().slice(0, 10);
    return `${i + 1}. [${p.title}](${p.url}) — ${date}`;
  });

  return [
    head,
    follow,
    ...lines,
  ].join("\n");
}
