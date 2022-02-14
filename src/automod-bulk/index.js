
const fs = require("fs").promises;
const axios = require("axios").default;
const path = require("path");

const load = async (url) => {
  const bulkJSON = [];
  const suggestArray = await axios(url)
    .then((result) => result.data)
    .then((text) => text.split("\n"));
  const acceptedSuggestions = [];
  const incorrectSubmissions = [];
  // try parse json
  for (const suggest of suggestArray) {
    try {
      const result = JSON.parse(suggest);
      if (!result?.missed?.length) {
        incorrectSubmissions.push(result);
      } else {
        acceptedSuggestions.push(result);
      }
    } catch (err) {
      console.log(err);
    }
  }
  acceptedSuggestions.forEach((suggest) => {
    bulkJSON.push({
      key: "missed:"+suggest.video_id,
      value: JSON.stringify(suggest)
    });
  });
  incorrectSubmissions.forEach((suggest) => {
    bulkJSON.push({
      key: "missed:"+suggest.video_id,
      value: JSON.stringify(suggest)
    });
  });
  await fs.writeFile(path.join(__dirname, "upload.json"), JSON.stringify(bulkJSON, null, 2));
};
load("https://bin.mchang.xyz/b/ctjrG");