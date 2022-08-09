const { hideOption, findOption, videoIDRequired } = require("../util/commandOptions.js");
const { shareUnsubmitted } = require("../util/formatResponse.js");
const { contentResponse } = require("../util/discordResponse.js");
const regex = new RegExp(/https:\/\/bin\.mchang\.xyz\/b\/(.+)/);

module.exports = {
  name: "shareunsubmitted",
  description: "Generate link for videoID for unsubmitted segments",
  options: [{
    name: "binid",
    description: "bin ID for raw debug text (https://bin.mchang.xyz/upload)",
    type: 3,
    required: true
  }, videoIDRequired, hideOption],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let binID = findOption(interaction, "binid") || "";
    const videoID = findOption(interaction, "videoid") || "";
    if (regex.test(binID)) binID = binID.match(regex)[1];
    const hide = findOption(interaction, "hide") ?? false;
    const url = `https://bin.mchang.xyz/b/${binID}`;
    // fetch
    const result = await fetch(url);
    if (!result.ok) return response(contentResponse("Failed to fetch, maybe try reuploading\n https://bin.mchang.xyz/upload"));
    // send response
    try {
      const json = await result.json();
      const unsubmitted = json.config.unsubmittedSegments;
      const submitLink = shareUnsubmitted(unsubmitted, videoID);
      if (!submitLink) return response(contentResponse("videoID not found"));
      return response(contentResponse(`[load segments](${submitLink})`, hide));
    } catch (error) {
      return response(contentResponse("bad json - error" + error));
    }
  }
};
