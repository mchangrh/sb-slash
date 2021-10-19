const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { getSearchSegments } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { findVideoID, strictVideoID } = require("../util/parseUrl.js");
const { videoIDOption, hideOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "searchsegments",
  description: "Get All Segments on Video",
  options: [
    videoIDOption,
    {
      name: "page",
      description: "Page of response",
      type: ApplicationCommandOptionType.INTEGER
    },
    {
      name: "minvotes",
      description: "Minimum Vote Threshold",
      type: ApplicationCommandOptionType.INTEGER
    },
    {
      name: "maxvotes",
      description: "Maximum Vote Threshold",
      type: ApplicationCommandOptionType.INTEGER
    },
    {
      name: "minviews",
      description: "Minimum Vote Threshold",
      type: ApplicationCommandOptionType.INTEGER
    },
    {
      name: "maxviews",
      description: "Maximum Vote Threshold",
      type: ApplicationCommandOptionType.INTEGER
    },
    {
      name: "locked",
      description: "include locked segments",
      type: ApplicationCommandOptionType.BOOLEAN
    },
    {
      name: "hidden",
      description: "include hidden segments",
      type: ApplicationCommandOptionType.BOOLEAN
    },
    {
      name: "ignored",
      description: "include ignored segments (hidden or downvoted)",
      type: ApplicationCommandOptionType.BOOLEAN
    },
    {
      name: "json",
      description: "return response as JSON",
      type: ApplicationCommandOptionType.BOOLEAN
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = ((interaction.data.options.find((opt) => opt.name === "videoid") || {}).value || "").trim();
    const page = ((interaction.data.options.find((opt) => opt.name === "page") || {}).value || 0);
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    const json = (interaction.data.options.find((opt) => opt.name === "json") || {}).value;
    // construct URL with filters
    const filterObj = {
      minVotes: ((interaction.data.options.find((opt) => opt.name === "minVotes") || {}).value),
      maxVotes: ((interaction.data.options.find((opt) => opt.name === "maxVotes") || {}).value),
      minViews: ((interaction.data.options.find((opt) => opt.name === "minViews") || {}).value),
      maxViews: ((interaction.data.options.find((opt) => opt.name === "maxViews") || {}).value),
      locked: ((interaction.data.options.find((opt) => opt.name === "locked") || {}).value),
      hidden: ((interaction.data.options.find((opt) => opt.name === "hidden") || {}).value),
      ignored: ((interaction.data.options.find((opt) => opt.name === "ignored") || {}).value)
    };
    let paramString = "";
    for (const [key, value] of Object.entries(filterObj)) {
      if (value) paramString += `&${key}=${value}`;
    }
    console.log(paramString);
    // check for video ID - if not stricly videoID, then try searching, then return original text if not found
    if (!strictVideoID(videoID)) {
      videoID = findVideoID(videoID) || videoID;
    }
    // fetch
    const body = await getSearchSegments(videoID, page, paramString);
    const responseTemplate = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: (hide ? 64 : 0)
      }
    };
    if (json) {
      const stringified = (body === "Not Found" ? body : JSON.stringify(JSON.parse(body), null, 4));
      responseTemplate.data.content = "```json\n"+stringified+"```";
    } else {
      responseTemplate.data.embeds = [formatSearchSegments(videoID, body)];
    }
    return response(responseTemplate);
  }
};
