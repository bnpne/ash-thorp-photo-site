import fs from "fs";
import path from "path";
import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "k3z72agi",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

const GHOST_META_PATH = path.join("./ghostmeta_WILLING.json");
const DOCUMENT_ID = "2d70d369-268e-4f01-812f-683012ad4580";

async function patchGhostMeta() {
  const ghostMeta = JSON.parse(fs.readFileSync(GHOST_META_PATH, "utf-8"));

  await client
    .patch(DOCUMENT_ID)
    .set({ ghostMeta })
    .commit()
    .then(() => {
      console.log(`✅ ghostMeta added to ${DOCUMENT_ID}`);
    })
    .catch((err) => {
      console.error(`❌ Failed to patch:`, err.message);
    });
}

patchGhostMeta().catch(console.error);
