const { formatShowoff } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfoShowoff } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { publicIDOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "showoff",
  description: "Show off your stats",
  options: [ publicIDOption ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = findOptionString(interaction, "publicid");
    // check for invalid publicID
    if (!userLinkCheck(publicid)) return response(invalidPublicID);
    const userID = userLinkExtract(publicid);
    // fetch
    const res = await getUserInfoShowoff(userID);
    return response({
      type: 4,
      data: {
        embeds: [formatShowoff(userID, res)]
      }
    });
  }
};
