const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { CATEGORIES_ARR, CATEGORIES_STRING } = require("../util/categories.js");
const CATEGORY_CHOICES = ["all", ...CATEGORIES_ARR];
const { getSkipSegments } = require("../util/min-api.js");
const { formatSkipSegments } = require("../util/formatResponse.js");
const { findVideoID, strictVideoID } = require("./parseUrl.js");

module.exports = {
  type: 1,
  name: "skipsegments",
  description: "Get Segments on Video",
  options: [
    {
      name: "videoid",
      description: "video ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
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
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = ((interaction.data.options.find((opt) => opt.name === "videoid") || {}).value || "").trim();
    const category = ((interaction.data.options.find((opt) => opt.name === "category") || {}).value || "all").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    const json = (interaction.data.options.find((opt) => opt.name === "json") || {}).value;
    // construct URL
    const categoryParam = (category === "all") ? CATEGORIES_STRING : `category=${category}`;
    // check for video ID - if not stricly videoID, then try searching, then return original text if not found
    if (!strictVideoID(videoID)) {
      videoID = findVideoID(videoID) || videoID;
    }
    // fetch
    const body = await getSkipSegments(videoID, categoryParam);
    let responseTemplate = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
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
