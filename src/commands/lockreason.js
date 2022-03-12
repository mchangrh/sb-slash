const { getLockReason, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatLockReason } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDRequired, findOption, findOptionString } = require("../util/commandOptions.js");
const { timeoutResponse, invalidVideoID } = require("../util/invalidResponse.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

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
    const subreq = await Promise.race([getLockReason(videoID), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) { // no request errors
      return response(embedResponse(formatLockReason(videoID, result.data)), hide);
    } else { // handle error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else {
        return response(contentResponse(result.error));
      }
    }
  }
};
