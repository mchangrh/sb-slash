const { getLockReason, TIMEOUT } = require("../util/min-api.js");
const { formatLockReason } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDRequired, findOption } = require("../util/commandOptions.js");
const { invalidVideoID } = require("../util/invalidResponse.js");
const { handleResponse } = require("../util/handleResponse.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "lockreason",
  description: "Retrieve video lock reason & lock users",
  options: [
    videoIDRequired,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = findOption(interaction, "videoid") || "";
    const hide = findOption(interaction, "hide") ?? false;
    // check for video ID
    videoID = findVideoID(videoID);
    if (!videoID) return response(invalidVideoID);
    // fetch
    const subreq = await Promise.race([getLockReason(videoID), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) =>
      embedResponse(formatLockReason(videoID, data), hide);
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
