const { getNextFromEmbed } = require("../util/classify.js");

module.exports = {
  name: "classify_skip",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
