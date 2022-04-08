const { CATEGORY_NAMES } = require("sb-category-type");
const ALL_CATEGORIES = `categories=${JSON.stringify(CATEGORY_NAMES)}`;
const { getSkipSegments, TIMEOUT } = require("../util/min-api.js");
const { invalidVideoID } = require("../util/invalidResponse.js");
const { findVideoID } = require("../util/validation.js");
const { videoIDRequired, hideOption, findOption } = require("../util/commandOptions.js");
const { contentResponse } = require("../util/discordResponse.js");
const { handleResponse } = require("../util/handleResponse.js");
const { generateDisplay } = require("../util/previewVideo.js");

module.exports = {
  name: "previewvideo",
  description: "Preview segments on video",
  options: [
    videoIDRequired,
    {
      name: "spots",
      description: "Number of spots to display",
      type: 4,
      min_value: 10,
      max_value: 50
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const videoID = findVideoID(findOption(interaction, "videoid"));
    const spots = findOption(interaction, "spots") ?? 20;
    const hide = findOption(interaction, "hide") ?? false;
    // check for video ID
    if (!videoID) return response(invalidVideoID);
    // send subrequest
    const subreq = await Promise.race([getSkipSegments(videoID, ALL_CATEGORIES), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => contentResponse(
      generateDisplay(videoID, data, spots), hide
    );
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
