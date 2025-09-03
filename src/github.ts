import { request } from "undici";

export async function getReadme(owner: string, repo: string, token: string) {
  const res = await request(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "medium-on-readme"
    }
  });
  if (res.statusCode >= 400) throw new Error(`GET README failed: ${res.statusCode}`);
  const data = await res.body.json() as any;
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { content, sha: data.sha };
}

export async function putReadme(owner: string, repo: string, token: string, newContent: string, sha: string) {
  const body = {
    message: "chore: update Medium section [skip ci]",
    content: Buffer.from(newContent).toString("base64"),
    sha
  };
  const res = await request(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "medium-on-readme"
    },
    body: JSON.stringify(body)
  });
  if (res.statusCode >= 300) {
    throw new Error(`PUT README failed: ${res.statusCode} ${await res.body.text()}`);
  }
}
