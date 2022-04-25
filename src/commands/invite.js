const { emptyEmbed } = require ("../util/formatResponse.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "invite",
  description: "Get a link to invite sb-slash to your server",
  execute: ({ response }) => {
    const embed = emptyEmbed();
    embed.description = "Click [here](https://slash.sb.mchang.xyz/invite) to invite sb-slash to your server";
    return response(embedResponse(embed, true));
  }
};
