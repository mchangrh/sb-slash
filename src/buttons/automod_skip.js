const { sendAutoMod } = require("../util/automod.js");

module.exports = {
  name: "automod_skip",
  execute: async ({ response }) => {
    const message = await sendAutoMod();
    return response(message);
  }
};
