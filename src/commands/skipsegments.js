const { CATEGORY_NAMES } = require("sb-category-type");
const CATEGORY_CHOICES = ["all", ...CATEGORY_NAMES];
const ALL_CATEGORIES = `categories=${JSON.stringify(CATEGORY_NAMES)}`;
const { getSkipSegments, timeout } = require("../util/min-api.js");
const { formatSkipSegments } = require("../util/formatResponse.js");
const { invalidVideoID, timeoutResponse } = require("../util/invalidResponse.js");
const { findVideoID } = require("../util/validation.js");
const { videoIDOption, hideOption, findOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "skipsegments",
  description: "Get Segments on Video",
  options: [
    videoIDOption,
    {
      name: "category",
      description: "category of segment",
      type: 3,
      required: false,
      choices: CATEGORY_CHOICES.map((category) => ({
        name: category,
        value: category
      }))
    },
    {
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
    // fetch
    const body = await Promise.race([getSkipSegments(videoID, categoryParam), timeout]);
    if (!body) return response(timeoutResponse);
    let responseTemplate = {
      type: 4,
      data: {
        flags: (hide ? 64 : 0)
      }
    };
    if (json) {
      const stringified = (body === "Not Found" ? body : JSON.stringify(JSON.parse(body), null, 4));
      responseTemplate.data.content = "```json\n"+stringified+"```";
    } else {
      responseTemplate.data.embeds = [formatSkipSegments(videoID, body)];
    }
    return response(responseTemplate);
  }
};
