const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const CATEGORIES = ["all", "sponsor", "intro", "outro", "selfpromo", "interaction", "music_offtopic", "preview"];
const ALLCATEGORIES = `["${CATEGORIES.slice(1).join("\",\"")}"]`;
const { getSkipSegments } = require("../util/min-api.js");

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
      choices: CATEGORIES.map((category) => ({
        name: category,
        value: category
      }))
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
    const videoID = ((interaction.data.options.find((opt) => opt.name === "videoid") || {}).value || "").trim();
    const category = ((interaction.data.options.find((opt) => opt.name === "category") || {}).value || "all").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // construct URL
    const categoryParam = (category === "all") ? `categories=${ALLCATEGORIES}` : `category=${category}`;
    // fetch
    const body = await getSkipSegments(videoID, categoryParam);
    const stringified = (body === "Not Found" ? body : JSON.stringify(JSON.parse(body), null, 4));
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "```json\n"+stringified+"```",
        flags: (hide ? 64 : 0)
      }
    });
  }
};
