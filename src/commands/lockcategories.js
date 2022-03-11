const { getLockCategories, timeout } = require("../util/min-api.js");
const { formatLockCategories } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDRequired, findOption, findOptionString } = require("../util/commandOptions.js");
const { timeoutResponse, invalidVideoID } = require("../util/invalidResponse.js");

module.exports = {
  name: "lockcategories",
  description: "retrieves video lock categories",
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
    const body = await Promise.race([getLockCategories(videoID), timeout]);
    if (!body) return response(timeoutResponse);
    const embed = formatLockCategories(videoID, body);
    return response({
      type: 4,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
