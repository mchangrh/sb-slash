const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { formatUserStats } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserStats } = require("../util/min-api.js");
const { linkCheck, linkExtract } = require("../util/userUUID.js");
const { hideOption, publicIDOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "userstats",
  description: "retrieves user statistics",
  options: [
    publicIDOption,
    {
      name: "sort",
      description: "Sort categories in descending order",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    const sort = (interaction.data.options.find((opt) => opt.name === "sort") || {}).value;
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid publicID
    if (!linkCheck(publicid)) return response(invalidPublicID);
    const userID = linkExtract(publicid);
    // fetch
    const parsedUser = await getUserStats(userID);
    const embed = formatUserStats(userID, parsedUser,sort);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
