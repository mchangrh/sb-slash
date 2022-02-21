const { getNextFromEmbed } = require("../util/automod.js");

module.exports = {
  name: "automod_skip",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
