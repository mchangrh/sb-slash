const { getNextFromEmbed } = require("../util/automod.js");
const { ml } = require("../util/automod_api.js");

module.exports = {
  name: "automod_done",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    await ml("done", { videoid: embed.title });
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
