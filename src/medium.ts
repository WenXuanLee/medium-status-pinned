import { request } from "undici";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";

export type Post = { title: string; url: string; publishedAt: string };

export async function getFollowerCount(username: string): Promise<number | null> {
  try {
    const res = await request(`https://medium.com/@${username}`);
    if (res.statusCode >= 400) return null;
    const html = await res.body.text();
    const $ = cheerio.load(html);

    // Medium HTML changes often; fallback selector
    const text = $('[href$="/followers"]').text() || "";
    const match = text.match(/[\d,]+/);
    if (!match) return null;
    return parseInt(match[0].replace(/,/g, ""), 10);
  } catch {
    return null;
  }
}

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
