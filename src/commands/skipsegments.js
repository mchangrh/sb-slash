const { ApplicationCommandOptionType } = require("slash-commands");
const { CATEGORIES_ARR, CATEGORIES_STRING } = require("../util/categories.js");
const CATEGORY_CHOICES = ["all", ...CATEGORIES_ARR];
const { getSkipSegments } = require("../util/min-api.js");
const { formatSkipSegments } = require("../util/formatResponse.js");
const { invalidVideoID } = require("../util/invalidResponse.js");
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
      type: ApplicationCommandOptionType.STRING,
      required: false,
      choices: CATEGORY_CHOICES.map((category) => ({
        name: category,
        value: category
      }))
    },
    {
      name: "json",
      description: "output as JSON",
      type: ApplicationCommandOptionType.BOOLEAN,
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
    const categoryParam = (category === "all") ? CATEGORIES_STRING : `category=${category}`;
    // check for video ID
    videoID = findVideoID(videoID) || videoID;
    if (!videoID) return response(invalidVideoID);
    // fetch
    const body = await getSkipSegments(videoID, categoryParam);
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
