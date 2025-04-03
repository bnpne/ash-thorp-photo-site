import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "k3z72agi",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

async function patchPhotoMetadata() {
  const docs = await client.fetch(`
    *[_type == "photoBase" && defined(photo.asset)]{
      _id,
      photo {
        asset->
      }
    }
  `);

  for (const doc of docs) {
    const asset = doc.photo.asset;
    if (!asset?.metadata) {
      console.log(`⚠️ No metadata for ${doc._id}`);
      continue;
    }

    const { dimensions, exif, location, palette } = asset.metadata;

    const patch = {
      "photo.metadata": { dimensions, exif, location, palette },
    };

    await client
      .patch(doc._id)
      .set(patch)
      .commit()
      .then(() => console.log(`✅ Patched ${doc._id}`))
      .catch((err) =>
        console.error(`❌ Error patching ${doc._id}:`, err.message),
      );
  }

  console.log("🎉 Done patching all photoBase documents.");
}

patchPhotoMetadata().catch(console.error);
