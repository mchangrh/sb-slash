const { sendAutoMod } = require("../util/automod.js");
const { done } = require("../util/automod_api.js");

module.exports = {
  name: "automod_done",
  execute: async ({ interaction, response }) => {
    await done(interaction.message.embeds[0].title);
    const message = await sendAutoMod();
    return response(message);
  }
};
