const fs = require("fs");

// Your file listing data (directly copied from what you provided)
const fileListingData = `
-rwxr--r--@ 1 benpaine  staff  1038873 Mar 20 01:07 1.jpg*
-rwxr--r--@ 1 benpaine  staff   417439 Mar 20 01:07 10.jpg*
-rwxr--r--@ 1 benpaine  staff   438089 Mar 20 01:07 11.jpg*
-rwxr--r--@ 1 benpaine  staff   696512 Mar 20 01:07 12.jpg*
-rwxr--r--@ 1 benpaine  staff   726313 Mar 20 01:07 13.jpg*
-rwxr--r--@ 1 benpaine  staff   374868 Mar 20 01:07 14.jpg*
-rwxr--r--@ 1 benpaine  staff   766173 Mar 20 01:07 15.jpg*
-rwxr--r--@ 1 benpaine  staff   541444 Mar 20 01:07 16.jpg*
-rwxr--r--@ 1 benpaine  staff   753545 Mar 20 01:07 17.jpg*
-rwxr--r--@ 1 benpaine  staff   323181 Mar 20 01:07 18.jpg*
-rwxr--r--@ 1 benpaine  staff   548286 Mar 20 01:07 19.jpg*
-rwxr--r--@ 1 benpaine  staff   864362 Mar 20 01:07 2.jpg*
-rwxr--r--@ 1 benpaine  staff   497307 Mar 20 01:07 20.jpg*
-rwxr--r--@ 1 benpaine  staff   646079 Mar 20 01:07 21.jpg*
-rwxr--r--@ 1 benpaine  staff  1116912 Mar 20 01:07 22.jpg*
-rwxr--r--@ 1 benpaine  staff   505620 Mar 20 01:07 23.jpg*
-rwxr--r--@ 1 benpaine  staff   465942 Mar 20 01:07 24.jpg*
-rwxr--r--@ 1 benpaine  staff  1007938 Mar 20 01:07 25.jpg*
-rwxr--r--@ 1 benpaine  staff   377885 Mar 20 01:07 26.jpg*
-rwxr--r--@ 1 benpaine  staff   648839 Mar 20 01:07 27.jpg*
-rwxr--r--@ 1 benpaine  staff   739726 Mar 20 01:07 28.jpg*
-rwxr--r--@ 1 benpaine  staff  1054658 Mar 20 01:07 29.jpg*
-rwxr--r--@ 1 benpaine  staff   611446 Mar 20 01:07 3.jpg*
-rwxr--r--@ 1 benpaine  staff   312278 Mar 20 01:07 30.jpg*
-rwxr--r--@ 1 benpaine  staff   281942 Mar 20 01:07 31.jpg*
-rwxr--r--@ 1 benpaine  staff   878496 Mar 20 01:07 32.jpg*
-rwxr--r--@ 1 benpaine  staff   848151 Mar 20 01:07 33.jpg*
-rwxr--r--@ 1 benpaine  staff   777123 Mar 20 01:07 34.jpg*
-rwxr--r--@ 1 benpaine  staff   359335 Mar 20 01:07 35.jpg*
-rwxr--r--@ 1 benpaine  staff   566872 Mar 20 01:07 36.jpg*
-rwxr--r--@ 1 benpaine  staff   498506 Mar 20 01:07 37.jpg*
-rwxr--r--@ 1 benpaine  staff  1098539 Mar 20 01:07 38.jpg*
-rwxr--r--@ 1 benpaine  staff   522754 Mar 20 01:07 39.jpg*
-rwxr--r--@ 1 benpaine  staff   488265 Mar 20 01:07 4.jpg*
-rwxr--r--@ 1 benpaine  staff  1050245 Mar 20 01:07 40.jpg*
-rwxr--r--@ 1 benpaine  staff   501401 Mar 20 01:07 41.jpg*
-rwxr--r--@ 1 benpaine  staff   338316 Mar 20 01:07 42.jpg*
-rwxr--r--@ 1 benpaine  staff   829574 Mar 20 01:07 43.jpg*
-rwxr--r--@ 1 benpaine  staff   822334 Mar 20 01:07 44.jpg*
-rwxr--r--@ 1 benpaine  staff   787786 Mar 20 01:07 45.jpg*
-rwxr--r--@ 1 benpaine  staff   724571 Mar 20 01:07 46.jpg*
-rwxr--r--@ 1 benpaine  staff   435044 Mar 20 01:07 47.jpg*
-rwxr--r--@ 1 benpaine  staff   736711 Mar 20 01:07 48.jpg*
-rwxr--r--@ 1 benpaine  staff   388044 Mar 20 01:07 49.jpg*
-rwxr--r--@ 1 benpaine  staff   670580 Mar 20 01:07 5.jpg*
-rwxr--r--@ 1 benpaine  staff   574244 Mar 20 01:07 50.jpg*
-rwxr--r--@ 1 benpaine  staff   500867 Mar 20 01:07 51.jpg*
-rwxr--r--@ 1 benpaine  staff   746057 Mar 20 01:07 52.jpg*
-rwxr--r--@ 1 benpaine  staff   418119 Mar 20 01:07 53.jpg*
-rwxr--r--@ 1 benpaine  staff   253996 Mar 20 01:07 55.jpg*
-rwxr--r--@ 1 benpaine  staff   934045 Mar 20 01:07 56.jpg*
-rwxr--r--@ 1 benpaine  staff   420110 Mar 20 01:07 57.jpg*
-rwxr--r--@ 1 benpaine  staff   428374 Mar 20 01:07 6.jpg*
-rwxr--r--@ 1 benpaine  staff   195070 Mar 20 01:07 7.jpg*
-rwxr--r--@ 1 benpaine  staff   908787 Mar 20 01:07 8.jpg*
-rwxr--r--@ 1 benpaine  staff   377728 Mar 20 01:07 9.jpg*
`;

const lines = fileListingData.trim().split("\n");

function extractImageNumber(filename) {
  const match = filename.match(/(\d+)\.jpg/);
  if (match) {
    return String(parseInt(match[1], 10)).padStart(3, "0");
  }
  return null;
}

const ndjsonEntries = [];

lines.forEach((line) => {
  if (line.includes(".jpg")) {
    const parts = line.trim().split(/\s+/);
    const filename = parts[8]?.replace(/\*$/, ""); // Remove trailing "*"
    const imageNumber = extractImageNumber(filename);

    if (filename && imageNumber) {
      const sanityObject = {
        _type: "photoBase",
        title: `q5-${imageNumber}`,
        slug: { current: `q5-${imageNumber}` }, // Slug with prefix for clarity
        photo: {
          _type: "image",
          _sanityAsset: `image@file:///Users/benpaine/Downloads/2025 Q1 Photos/${filename}`,
          metadata: {
            dimensions,
            exif,
          },
        },
      };

      ndjsonEntries.push(JSON.stringify(sanityObject));
    }
  }
});

fs.writeFileSync("sanity_upload_q5.ndjson", ndjsonEntries.join("\n"));
console.log(
  `✅ Generated ${ndjsonEntries.length} entries to sanity_upload_q5.ndjson`,
);
