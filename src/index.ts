import { getLatestPosts } from "./medium.js";
import { injectContent, renderMarkdown } from "./readme.js";
import { getReadme, putReadme } from "./github.js";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const {
    MEDIUM_USERNAME,
    MEDIUM_LIMIT = "5",
    GITHUB_TOKEN,
    GITHUB_REPOSITORY // format: owner/repo (provided by Actions)
  } = process.env;

  if (!MEDIUM_USERNAME) throw new Error("Missing MEDIUM_USERNAME");
  if (!GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN");
  if (!GITHUB_REPOSITORY) throw new Error("Missing GITHUB_REPOSITORY");

  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  const posts = await getLatestPosts(MEDIUM_USERNAME, Number(MEDIUM_LIMIT));
  const list = renderMarkdown(posts);

  const { content: readme, sha } = await getReadme(owner, repo, GITHUB_TOKEN);
  const updated = injectContent(readme, list);

  if (updated.trim() === readme.trim()) {
    console.log("No change. Skipping commit.");
    return;
  }
  await putReadme(owner, repo, GITHUB_TOKEN, updated, sha);
  console.log("README updated.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
