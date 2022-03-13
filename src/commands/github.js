const { emptyEmbed } = require ("../util/formatResponse.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "github",
  description: "Get a link for the sb-slash GitHub",
  execute: ({ response }) => {
    const embed = emptyEmbed();
    embed.description = "Visit the [GitHub](https://github.com/mchangrh/sb-slash) to report any issues, make any feature requests or fork the source code";
    return response(embedResponse(embed));
  }
};
