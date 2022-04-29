const { emptyEmbed } = require ("../util/formatResponse.js");
const { componentResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "logo",
  description: "Get a random SponsorBlock Logo",
  execute: ({ response }) => {
    const embed = emptyEmbed();
    const choices = ["vuetube", "ecoli"];
    const choice = choices[Math.floor(Math.random() * choices.length)];
    const picture = "https://logo.sb.mchang.xyz/logos/" + choice + ".png";
    embed.image = {
      url: picture
    };
    return response(componentResponse(embed, [{
      type: 1,
      components: [{
        type: 2,
        label: "Make this an NFT",
        style: 5,
        url: "https://en.wikipedia.org/wiki/Climate_change#Drivers_of_recent_temperature_rise"
      }]
    }]));
  }
};
