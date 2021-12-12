const { formatUserStats } = require("../util/formatResponse.js");
const { invalidPublicID, timeoutResponse } = require("../util/invalidResponse.js");
const { getUserStats, timeout } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { hideOption, publicIDOption, findOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "userstats",
  description: "retrieves user statistics",
  options: [
    publicIDOption,
    {
      name: "sort",
      description: "Sort categories in descending order",
      type: 5,
      required: false
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = findOptionString(interaction, "publicid");
    const sort = findOption(interaction, "sort");
    const hide = findOption(interaction, "hide");
    // check for invalid publicID
    if (!userLinkCheck(publicid)) return response(invalidPublicID);
    const userID = userLinkExtract(publicid);
    // fetch
    const parsedUser = await Promise.race([getUserStats(userID), timeout]);
    if (!parsedUser) return response(timeoutResponse);
    const embed = formatUserStats(userID, parsedUser,sort);
    return response({
      type: 4,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};