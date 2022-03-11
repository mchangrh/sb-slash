const { CATEGORY_NAMES, CATEGORY_LONGNAMES } = require("sb-category-type");
const ALL_CATEGORIES = `categories=${JSON.stringify(CATEGORY_NAMES)}`;
const { getSkipSegments, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatSkipSegments, segmentsNotFoundEmbed } = require("../util/formatResponse.js");
const { invalidVideoID, timeoutResponse, defaultResponse } = require("../util/invalidResponse.js");
const { findVideoID } = require("../util/validation.js");
const { videoIDRequired, hideOption, findOption, findOptionString } = require("../util/commandOptions.js");

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
    }, {
      name: "json",
      description: "output as JSON",
      type: 5,
      required: false
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = findOptionString(interaction, "videoid");
    const category = findOptionString(interaction, "category", "all");
    const hide = findOption(interaction, "hide");
    const json = findOption(interaction, "json");
    // construct URL
    const categoryParam = (category === "all") ? ALL_CATEGORIES : `category=${category}`;
    // check for video ID
    videoID = findVideoID(videoID) || videoID;
    if (!videoID) return response(invalidVideoID);
    // setup
    let responseEmbed = {
      type: 4,
      data: { flags: (hide ? 64 : 0) }
    };
    // fetch
    const subreq = await Promise.race([getSkipSegments(videoID, categoryParam), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      if (json) {
        const stringified = JSON.stringify(result.data, null, 4);
        responseEmbed.data.content = "```json\n"+stringified+"```";
      } else {
        responseEmbed.data.embeds = [formatSkipSegments(videoID, result.data)];
      }
      return response(responseEmbed);
    } else {
      // error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        responseEmbed.data.embeds = [segmentsNotFoundEmbed(videoID)];
        return response(responseEmbed);
      } else {
        return response(defaultResponse(result.error));
      }
    }
  }
};
