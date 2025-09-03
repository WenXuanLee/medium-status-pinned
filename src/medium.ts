import { request } from "undici";
import { parseStringPromise } from "xml2js";

export type Post = { title: string; url: string; publishedAt: string };

export async function getLatestPosts(username: string, limit = 5): Promise<Post[]> {
  const url = `https://medium.com/feed/@${username}`;
  const res = await request(url, { method: "GET" });
  if (res.statusCode >= 400) throw new Error(`RSS fetch failed: ${res.statusCode}`);
  const xml = await res.body.text();
  const parsed = await parseStringPromise(xml);
  const items = parsed?.rss?.channel?.[0]?.item ?? [];
  return items.slice(0, limit).map((item: any) => ({
    title: item.title?.[0],
    url: item.link?.[0],
    publishedAt: new Date(item.pubDate?.[0]).toISOString()
  }));
}
