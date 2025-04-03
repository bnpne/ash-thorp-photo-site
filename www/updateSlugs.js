import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "k3z72agi",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/\//g, "-") // Replace forward slashes with hyphen
    .replace(/[^\w\- ]+/g, "") // Remove all non-word characters except hyphen and space
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .slice(0, 200); // Max slug length
}

async function updateSlugs() {
  const photoDocs = await client.fetch(`
    *[_type == "photoBase" && defined(title)]{
      _id,
      title,
      slug
    }
  `);

  for (const doc of photoDocs) {
    const newSlug = generateSlug(doc.title || "");
    if (!newSlug) {
      console.log(`⚠️ Skipping ${doc._id} — empty or invalid title`);
      continue;
    }

    await client
      .patch(doc._id)
      .set({ slug: { current: newSlug } })
      .commit()
      .then(() => console.log(`✅ Patched ${doc._id} with slug: ${newSlug}`))
      .catch((err) =>
        console.error(`❌ Failed to patch ${doc._id}:`, err.message),
      );
  }

  console.log("🎉 Slug patching complete.");
}

updateSlugs().catch(console.error);
