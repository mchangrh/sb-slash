const { sendAutoMod } = require("../util/automod.js");

module.exports = {
  name: "automod_done",
  execute: async ({ interaction, response }) => {
    const doneVideoID = interaction.message.embeds[0].title;
    XENOVA_ML.delete(doneVideoID);
    const message = await sendAutoMod();
    return response(message);
  }
};
