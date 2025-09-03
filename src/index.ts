import "dotenv/config";
import { getLatestPosts, getFollowerCount } from "./medium.js";
import { renderBox } from "./readme.js";
import { updateGist } from "./gist.js";

async function run() {
  const {
    MEDIUM_USERNAME,
    MEDIUM_LIMIT = "5",
    GITHUB_TOKEN,
    GITHUB_REPOSITORY,
    GIST_ID,
    GH_PAT,
  } = process.env;

  if (!MEDIUM_USERNAME) throw new Error("Missing MEDIUM_USERNAME");
  if (!GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN");
  if (!GITHUB_REPOSITORY) throw new Error("Missing GITHUB_REPOSITORY");

  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  const posts = await getLatestPosts(MEDIUM_USERNAME, Number(MEDIUM_LIMIT));

  // --- Update Gist ---
  if (GIST_ID && GH_PAT) {
    try {
      const followers = await getFollowerCount(MEDIUM_USERNAME);
      const box = renderBox(MEDIUM_USERNAME, followers, posts);

      await updateGist({
        gistId: GIST_ID,
        filename: "medium-latest.md",
        content: box,
        token: GH_PAT,
      });

      console.log("✅ Gist updated");
    } catch (err) {
      console.error("❌ Failed to update Gist:", err);
    }
  } else {
    console.log("ℹ️ Skipping Gist update (missing GIST_ID or GH_PAT)");
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
