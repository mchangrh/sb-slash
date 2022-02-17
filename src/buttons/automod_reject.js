const { sendAutoMod } = require("../util/automod.js");
const { reject } = require("../util/automod_api.js");

module.exports = {
  name: "automod_reject",
  execute: async ({ interaction, response }) => {
    await reject(interaction.message.embeds[0].title);
    const message = await sendAutoMod();
    return response(message);
  }
};
