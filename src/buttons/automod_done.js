const { getNextFromEmbed } = require("../util/automod.js");
const { done } = require("../util/automod_api.js");

module.exports = {
  name: "automod_done",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    await done(embed.title);
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
