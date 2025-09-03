import { request } from "undici";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";

export type Post = { title: string; url: string; publishedAt: string };


export async function getFollowerCount(username: string): Promise<number | null> {
  try {
    const res = await request(`https://medium.com/@${username}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (res.statusCode >= 400) return null;
    const html = await res.body.text();
    const $ = cheerio.load(html);

    // 1) Exact profile followers link: /@<username>/followers
    const selExact = $('a[href*="/followers"]').first().text().trim();

    // 2) Fallback: any link ending with /followers that contains the word "followers"
    const selFallback = $('a[href$="/followers"]').filter((_, el) =>
      $(el).text().toLowerCase().includes("followers")
    ).first().text();

    const txt = (selExact || selFallback || "").replace(/\s+/g, " ").trim();
    const m = txt.match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
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
