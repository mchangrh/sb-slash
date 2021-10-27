const { getLockReason } = require("../util/min-api.js");
const { formatLockReason } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDOption, findOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "lockreason",
  description: "retrieves video lock reason & lock uesrs",
  options: [
    videoIDOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = findOptionString(interaction, "videoid");
    const hide = findOption(interaction, "hide");
    // check for video ID
    videoID = findVideoID(videoID) || videoID;
    if (!videoID) return response(invalidVideoID);
    // fetch
    const body = await getLockReason(videoID);
    const embed = formatLockReason(videoID, body);
    return response({
      type: 4,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
