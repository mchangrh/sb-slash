const { InteractionResponseType } = require("discord-interactions");
const { formatShowoff } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfoShowoff } = require("../util/min-api.js");
const { linkCheck, linkExtract } = require("../util/userUUID.js");
const { publicIDOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "showoff",
  description: "Show off your stats",
  options: [ publicIDOption ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    // check for invalid publicID
    if (!linkCheck(publicid)) return response(invalidPublicID);
    const userID = linkExtract(publicid);
    // fetch
    const res = await getUserInfoShowoff(userID);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [formatShowoff(userID, res)]
      }
    });
  }
};
