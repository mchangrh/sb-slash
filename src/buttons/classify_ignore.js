const { getNextFromEmbed } = require("../util/classify.js");
const { classify } = require("../util/automod_api.js");

module.exports = {
  name: "classify_ignore",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    await classify("ignore", { uuid: embed.title });
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
