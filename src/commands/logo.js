const { emptyEmbed } = require ("../util/formatResponse.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "logo",
  description: "Get a random SponsorBlock Logo",
  execute: ({ response }) => {
    const embed = emptyEmbed();
    const cacheBust = Math.floor(Math.random()*100);
    embed.image = {
      url: "https://sb-logo.mchang.workers.dev?rand="+cacheBust
    };
    return response(embedResponse(embed));
  }
};
