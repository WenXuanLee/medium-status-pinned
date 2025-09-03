import { request } from "undici";

export async function updateGist({
  gistId,
  filename,
  content,
  token
}: {
  gistId: string;
  filename: string;
  content: string;
  token: string;
}) {
  const res = await request(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "medium-on-readme"
    },
    body: JSON.stringify({ files: { [filename]: { content } } })
  });

  if (res.statusCode >= 300) {
    throw new Error(`Failed to update gist: ${res.statusCode} ${await res.body.text()}`);
  }

  console.log(`✅ Gist ${gistId} updated`);
}
