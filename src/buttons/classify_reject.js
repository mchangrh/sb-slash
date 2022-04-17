const { getNextFromEmbed } = require("../util/classify.js");
const { classify } = require("../util/classify_api.js");

module.exports = {
  name: "classify_reject",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    await classify("reject", { uuid: embed.title });
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
