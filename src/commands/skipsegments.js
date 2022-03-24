const { CATEGORY_NAMES, CATEGORY_LONGNAMES } = require("sb-category-type");
const ALL_CATEGORIES = `categories=${JSON.stringify(CATEGORY_NAMES)}`;
const { getSkipSegments, TIMEOUT } = require("../util/min-api.js");
const { formatSkipSegments } = require("../util/formatResponse.js");
const { invalidVideoID } = require("../util/invalidResponse.js");
const { findVideoID } = require("../util/validation.js");
const { videoIDRequired, hideOption, findOption } = require("../util/commandOptions.js");
const { embedResponse } = require("../util/discordResponse.js");
const { handleResponse } = require("../util/handleResponse.js");

const categoryChoices = Object.entries(CATEGORY_LONGNAMES).map((obj) => {
  return { name: obj[0], value: obj[1] };
});

module.exports = {
  name: "skipsegments",
  description: "Get Segments on Video",
  options: [
    videoIDRequired, {
      name: "category",
      description: "category of segment",
      type: 3,
      required: false,
      choices: [...categoryChoices, { name: "All Categories", value: "all" }]
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const videoID = findVideoID(findOption(interaction, "videoid"));
    const category = findOption(interaction, "category") || "all";
    const hide = findOption(interaction, "hide") ?? false;
    // construct URL
    const categoryParam = (category === "all") ? ALL_CATEGORIES : `category=${category}`;
    // check for video ID
    if (!videoID) return response(invalidVideoID);
    // send subrequest
    const subreq = await Promise.race([getSkipSegments(videoID, categoryParam), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => embedResponse(
      formatSkipSegments(videoID, data), hide
    );
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
