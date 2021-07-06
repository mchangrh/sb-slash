const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { getLockCategories } = require("../util/min-api.js");
const { formatLockCategories } = require("../util/formatResponse.js");

module.exports = {
  name: "lockcategories",
  description: "retreives video lock categories",
  options: [
    {
      name: "videoid",
      description: "Video ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
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
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // fetch
    const body = await getLockCategories(videoID);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatLockCategories(body),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
