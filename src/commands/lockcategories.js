const { getLockCategories, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatLockCategories, emptyVideoEmbed } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDRequired, findOption, findOptionString } = require("../util/commandOptions.js");
const { timeoutResponse, invalidVideoID } = require("../util/invalidResponse.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

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
    const hide = findOption(interaction, "hide") ?? false;
    // check for video ID
    videoID = findVideoID(videoID) || videoID;
    if (!videoID) return response(invalidVideoID);
    // setup
    const embed = emptyVideoEmbed(videoID);
    // fetch
    const subreq = await Promise.race([getLockCategories(videoID), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) { // no request errors
      return response(embedResponse(formatLockCategories(videoID, result.data), hide));
    } else { // handle error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        embed.fields.push({
          name: "Locked Categories",
          value: "None"
        });
        return response(embedResponse(embed, hide));
      } else {
        return response(contentResponse(result.error));
      }
    }
  }
};
