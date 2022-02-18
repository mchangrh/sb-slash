const { sendAutoMod } = require("../util/automod.js");

module.exports = {
  name: "automod_skip",
  execute: async ({ interaction, response }) => {
    const category = interaction.message.embeds[0].footer.text;
    const message = await sendAutoMod({category});
    return response(message);
  }
};
