import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "k3z72agi",
  dataset: "production",
  token:
    "skTY0j5eRtLooYEOV7ERJ5BUDrcIrS31YekT83nb4ecHDvNLjf3Bn7W91wt0ralJdR3t87lsL2L7tZ0Loc8wNiUq90UHI2eE6A1CEtlq6w18feFnBVMOhsu7VHCIMdO35XlNL1bknGyBte6jqLP8kY86KRnW2oBo3C3HGVTi2YgZn1NAR2yV", // must have write access
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
