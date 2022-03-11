const { getLockReason, timeout } = require("../util/min-api.js");
const { formatLockReason } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDRequired, findOption, findOptionString } = require("../util/commandOptions.js");
const { timeoutResponse } = require("../util/invalidResponse.js");

module.exports = {
  name: "lockreason",
  description: "retrieves video lock reason & lock uesrs",
  options: [
    videoIDRequired,
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
    const body = await Promise.race([getLockReason(videoID), timeout]);
    if (!body) return response(timeoutResponse);
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
