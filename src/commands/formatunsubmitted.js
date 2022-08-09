const { hideOption, findOption } = require("../util/commandOptions.js");
const { formatUnsubmitted } = require("../util/formatResponse.js");
const { contentResponse, embedResponse } = require("../util/discordResponse.js");
const regex = new RegExp(/https:\/\/bin\.mchang\.xyz\/b\/(.+)/);

module.exports = {
  name: "formatunsubmitted",
  description: "Format unsubmitted segments",
  options: [{
    name: "binid",
    description: "bin ID for raw debug text (https://bin.mchang.xyz/upload)",
    type: 3,
    required: true
  }, hideOption],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let binID = findOption(interaction, "binid") ?? "";
    if (regex.test(binID)) binID = binID.match(regex)[1];
    const hide = findOption(interaction, "hide") ?? true;
    const url = `https://bin.mchang.xyz/b/${binID}`;
    // fetch
    const result = await fetch(url);
    if (!result.ok) return response(contentResponse("Failed to fetch, maybe try reuploading\n https://bin.mchang.xyz/upload"));
    // send response
    try {
      const json = await result.json();
      const unsubmitted = json.config.unsubmittedSegments;
      const hasUnsubmitted = Object.values(unsubmitted).filter((x) => x.length)?.length;
      if (!hasUnsubmitted) return response(contentResponse("No unsubmitted segments"));
      return response(embedResponse(formatUnsubmitted(unsubmitted), hide));
    } catch (error) {
      return response(contentResponse("bad json - error" + error));
    }
  }
};
