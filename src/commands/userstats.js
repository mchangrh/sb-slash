const { formatUserStats } = require("../util/formatResponse.js");
const { invalidPublicID, timeoutResponse } = require("../util/invalidResponse.js");
const { getUserStats, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { hideOption, publicIDOptionRequired, pieChartOption, findOption, findOptionString } = require("../util/commandOptions.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "userstats",
  description: "retrieves user statistics",
  options: [
    publicIDOptionRequired,
    {
      name: "sort",
      description: "Sort categories in descending order",
      type: 5,
      required: false
    },
    hideOption,
    pieChartOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = findOptionString(interaction, "publicid");
    const sort = findOption(interaction, "sort");
    const hide = findOption(interaction, "hide") ?? false;
    const piechart = findOption(interaction, "piechart");
    // check for invalid publicID
    if (!userLinkCheck(publicid)) return response(invalidPublicID);
    const userID = userLinkExtract(publicid);
    // fetch
    const subreq = await Promise.race([getUserStats(userID), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) { // no request errors
      // get last segment time
      const embed = formatUserStats(userID, result.data, sort, piechart);
      return response(embedResponse(embed, hide));
    } else { // handle error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else {
        return response(contentResponse(result.error), true);
      }
    }
  }
};