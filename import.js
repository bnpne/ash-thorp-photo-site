const fs = require("fs");

// Your file listing data (directly copied from what you provided)
const fileListingData = `-rwxr--r--@ 1 benpaine  staff   447542 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(1).jpg*
-rwxr--r--@ 1 benpaine  staff   546754 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(10).jpg*
-rwxr--r--@ 1 benpaine  staff   485757 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(100).jpg*
-rwxr--r--@ 1 benpaine  staff   377127 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(101).jpg*
-rwxr--r--@ 1 benpaine  staff   586377 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(102).jpg*
-rwxr--r--@ 1 benpaine  staff   354213 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(103).jpg*
-rwxr--r--@ 1 benpaine  staff   368945 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(104).jpg*
-rwxr--r--@ 1 benpaine  staff   342689 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(105).jpg*
-rwxr--r--@ 1 benpaine  staff   350046 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(106).jpg*
-rwxr--r--@ 1 benpaine  staff   641476 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(107).jpg*
-rwxr--r--@ 1 benpaine  staff   421248 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(108).jpg*
-rwxr--r--@ 1 benpaine  staff   695133 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(109).jpg*
-rwxr--r--@ 1 benpaine  staff   435342 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(11).jpg*
-rwxr--r--@ 1 benpaine  staff   878655 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(110).jpg*
-rwxr--r--@ 1 benpaine  staff   676933 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(111).jpg*
-rwxr--r--@ 1 benpaine  staff   608479 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(112).jpg*
-rwxr--r--@ 1 benpaine  staff   775678 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(113).jpg*
-rwxr--r--@ 1 benpaine  staff   726749 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(114).jpg*
-rwxr--r--@ 1 benpaine  staff   532665 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(115).jpg*
-rwxr--r--@ 1 benpaine  staff   390412 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(116).jpg*
-rwxr--r--@ 1 benpaine  staff   361265 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(117).jpg*
-rwxr--r--@ 1 benpaine  staff   940972 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(118).jpg*
-rwxr--r--@ 1 benpaine  staff   821272 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(119).jpg*
-rwxr--r--@ 1 benpaine  staff   612820 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(12).jpg*
-rwxr--r--@ 1 benpaine  staff   374308 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(13).jpg*
-rwxr--r--@ 1 benpaine  staff   571363 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(14).jpg*
-rwxr--r--@ 1 benpaine  staff   487850 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(15).jpg*
-rwxr--r--@ 1 benpaine  staff   206650 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(16).jpg*
-rwxr--r--@ 1 benpaine  staff   857173 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(17).jpg*
-rwxr--r--@ 1 benpaine  staff   642159 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(18).jpg*
-rwxr--r--@ 1 benpaine  staff   564416 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(19).jpg*
-rwxr--r--@ 1 benpaine  staff   569747 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(2).jpg*
-rwxr--r--@ 1 benpaine  staff   460109 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(20).jpg*
-rwxr--r--@ 1 benpaine  staff   643970 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(21).jpg*
-rwxr--r--@ 1 benpaine  staff   835802 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(22).jpg*
-rwxr--r--@ 1 benpaine  staff   448162 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(23).jpg*
-rwxr--r--@ 1 benpaine  staff   417541 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(24).jpg*
-rwxr--r--@ 1 benpaine  staff   343703 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(25).jpg*
-rwxr--r--@ 1 benpaine  staff   511051 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(26).jpg*
-rwxr--r--@ 1 benpaine  staff   544997 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(27).jpg*
-rwxr--r--@ 1 benpaine  staff   519036 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(28).jpg*
-rwxr--r--@ 1 benpaine  staff   595787 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(29).jpg*
-rwxr--r--@ 1 benpaine  staff   515022 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(3).jpg*
-rwxr--r--@ 1 benpaine  staff   357680 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(30).jpg*
-rwxr--r--@ 1 benpaine  staff   525841 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(31).jpg*
-rwxr--r--@ 1 benpaine  staff   482492 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(32).jpg*
-rwxr--r--@ 1 benpaine  staff   522804 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(33).jpg*
-rwxr--r--@ 1 benpaine  staff   596616 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(34).jpg*
-rwxr--r--@ 1 benpaine  staff   606277 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(35).jpg*
-rwxr--r--@ 1 benpaine  staff   656568 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(36).jpg*
-rwxr--r--@ 1 benpaine  staff   404268 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(37).jpg*
-rwxr--r--@ 1 benpaine  staff   397548 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(38).jpg*
-rwxr--r--@ 1 benpaine  staff   772979 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(39).jpg*
-rwxr--r--@ 1 benpaine  staff   469894 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(4).jpg*
-rwxr--r--@ 1 benpaine  staff   663243 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(40).jpg*
-rwxr--r--@ 1 benpaine  staff   513950 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(41).jpg*
-rwxr--r--@ 1 benpaine  staff   448566 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(42).jpg*
-rwxr--r--@ 1 benpaine  staff   580815 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(43).jpg*
-rwxr--r--@ 1 benpaine  staff   749579 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(44).jpg*
-rwxr--r--@ 1 benpaine  staff  1037978 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(45).jpg*
-rwxr--r--@ 1 benpaine  staff   714441 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(46).jpg*
-rwxr--r--@ 1 benpaine  staff   888214 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(47).jpg*
-rwxr--r--@ 1 benpaine  staff   437207 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(48).jpg*
-rwxr--r--@ 1 benpaine  staff   644283 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(49).jpg*
-rwxr--r--@ 1 benpaine  staff   476336 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(5).jpg*
-rwxr--r--@ 1 benpaine  staff   906048 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(50).jpg*
-rwxr--r--@ 1 benpaine  staff   661831 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(51).jpg*
-rwxr--r--@ 1 benpaine  staff   544797 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(52).jpg*
-rwxr--r--@ 1 benpaine  staff   403130 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(53).jpg*
-rwxr--r--@ 1 benpaine  staff   430604 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(54).jpg*
-rwxr--r--@ 1 benpaine  staff   439341 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(55).jpg*
-rwxr--r--@ 1 benpaine  staff   375998 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(56).jpg*
-rwxr--r--@ 1 benpaine  staff   615916 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(57).jpg*
-rwxr--r--@ 1 benpaine  staff   424150 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(58).jpg*
-rwxr--r--@ 1 benpaine  staff   466605 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(59).jpg*
-rwxr--r--@ 1 benpaine  staff   523598 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(6).jpg*
-rwxr--r--@ 1 benpaine  staff   428338 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(60).jpg*
-rwxr--r--@ 1 benpaine  staff   582154 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(61).jpg*
-rwxr--r--@ 1 benpaine  staff   462823 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(62).jpg*
-rwxr--r--@ 1 benpaine  staff   462399 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(63).jpg*
-rwxr--r--@ 1 benpaine  staff   295211 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(64).jpg*
-rwxr--r--@ 1 benpaine  staff   525492 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(65).jpg*
-rwxr--r--@ 1 benpaine  staff   378217 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(66).jpg*
-rwxr--r--@ 1 benpaine  staff   485138 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(67).jpg*
-rwxr--r--@ 1 benpaine  staff   287345 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(68).jpg*
-rwxr--r--@ 1 benpaine  staff   328808 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(69).jpg*
-rwxr--r--@ 1 benpaine  staff   452293 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(7).jpg*
-rwxr--r--@ 1 benpaine  staff   445263 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(70).jpg*
-rwxr--r--@ 1 benpaine  staff   370759 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(71).jpg*
-rwxr--r--@ 1 benpaine  staff  1219048 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(72).jpg*
-rwxr--r--@ 1 benpaine  staff   567134 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(73).jpg*
-rwxr--r--@ 1 benpaine  staff   359509 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(74).jpg*
-rwxr--r--@ 1 benpaine  staff   772960 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(75).jpg*
-rwxr--r--@ 1 benpaine  staff   674945 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(76).jpg*
-rwxr--r--@ 1 benpaine  staff   734164 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(77).jpg*
-rwxr--r--@ 1 benpaine  staff   487217 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(78).jpg*
-rwxr--r--@ 1 benpaine  staff   301020 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(79).jpg*
-rwxr--r--@ 1 benpaine  staff   559510 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(8).jpg*
-rwxr--r--@ 1 benpaine  staff   576953 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(80).jpg*
-rwxr--r--@ 1 benpaine  staff   608051 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(81).jpg*
-rwxr--r--@ 1 benpaine  staff   563244 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(82).jpg*
-rwxr--r--@ 1 benpaine  staff   375310 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(83).jpg*
-rwxr--r--@ 1 benpaine  staff   383927 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(84).jpg*
-rwxr--r--@ 1 benpaine  staff   621866 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(85).jpg*
-rwxr--r--@ 1 benpaine  staff   531335 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(86).jpg*
-rwxr--r--@ 1 benpaine  staff   665822 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(87).jpg*
-rwxr--r--@ 1 benpaine  staff   424712 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(88).jpg*
-rwxr--r--@ 1 benpaine  staff   606691 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(89).jpg*
-rwxr--r--@ 1 benpaine  staff   512771 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(9).jpg*
-rwxr--r--@ 1 benpaine  staff   505606 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(90).jpg*
-rwxr--r--@ 1 benpaine  staff   675369 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(91).jpg*
-rwxr--r--@ 1 benpaine  staff   455129 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(92).jpg*
-rwxr--r--@ 1 benpaine  staff   552147 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(93).jpg*
-rwxr--r--@ 1 benpaine  staff   375819 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(94).jpg*
-rwxr--r--@ 1 benpaine  staff   475702 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(95).jpg*
-rwxr--r--@ 1 benpaine  staff   438067 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(96).jpg*
-rwxr--r--@ 1 benpaine  staff   515004 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(97).jpg*
-rwxr--r--@ 1 benpaine  staff   484976 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(98).jpg*
-rwxr--r--@ 1 benpaine  staff   475159 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_(99).jpg*
-rwxr--r--@ 1 benpaine  staff   599268 Mar 20 01:09 ALTSEEN_2024_Q4_SELECTS_001_001_.jpg*`;

const lines = fileListingData.split("\n");

// Function to extract the image number and format it
function extractImageNumber(filename) {
  // Check for base image with no parentheses
  if (filename.endsWith("_.jpg*")) {
    return "001";
  }

  // Pattern to match the number in parentheses
  const match = filename.match(/_\((\d+)\)\.jpg/);
  if (match) {
    // Get the number and format it as 3 digits
    const num = parseInt(match[1], 10);
    return String(num).padStart(3, "0"); // Format as 001, 002, etc.
  }

  return null; // Should not reach here if filenames are consistent
}

const ndjsonEntries = [];

// Process each line that contains a jpg file
lines.forEach((line) => {
  if (line.includes(".jpg")) {
    // Extract filename from the listing
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 9) {
      // Format is: permissions links user group size date time filename
      const filename = parts[8];

      // Remove the asterisk at the end if present
      const cleanFilename = filename.replace(/\*$/, "");

      // Extract image number
      const imageNumber = extractImageNumber(filename);

      if (imageNumber) {
        // Create Sanity object
        const sanityObject = {
          _type: "photoBase",
          title: imageNumber,
          photo: {
            _type: "image",
            _sanityAsset: `image@file:///Users/benpaine/Downloads/2024 Q4 Photos/${cleanFilename}`,
          },
          slug: `${imageNumber}_import`,
        };

        // Add to list of entries
        ndjsonEntries.push(JSON.stringify(sanityObject));
      }
    }
  }
});

// Write ndjson file
fs.writeFileSync("sanity_upload.ndjson", ndjsonEntries.join("\n"));

console.log(
  `Generated ${ndjsonEntries.length} ndjson entries in sanity_upload.ndjson`,
);
