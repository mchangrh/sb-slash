const { getNextFromEmbed } = require("../util/automod.js");
const { reject } = require("../util/automod_api.js");

module.exports = {
  name: "automod_reject",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    await reject(embed.title);
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
