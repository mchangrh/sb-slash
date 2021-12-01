const { findOptionString } = require("../util/commandOptions.js");
const { ApplicationCommandOptionType } = require("slash-commands");
const { formatUnsubmitted } = require("../util/formatResponse.js");
const { defaultResponse } = require("../util/invalidResponse.js");

module.exports = {
  name: "formatunsubmitted",
  description: "Format unsubmitted segments",
  options: [{
    name: "binid",
    description: "bin ID for raw debug text (https://bin.mchang.xyz/upload)",
    type: ApplicationCommandOptionType.STRING,
    required: true
  }],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const binID = findOptionString(interaction, "binid");
    const url = `https://bin.mchang.xyz/b/${binID}`;
    // fetch
    const result = await fetch(url);
    if (!result.ok) {
      return response(defaultResponse("Failed to fetch, maybe try reuploading\n https://bin.mchang.xyz/upload"));
    }
    try {
      const json = await result.json();
      return response({
        type: 4,
        data: {
          embeds: [formatUnsubmitted(json)],
          flags: 64 // hide
        }
      });
    } catch (error) {
      return response(defaultResponse("bad json - error" + error));
    }
  }
};
