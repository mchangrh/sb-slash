const { formatUserStats } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserStats, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { hideOption, publicIDOptionRequired, pieChartOption, findOption } = require("../util/commandOptions.js");
const { embedResponse } = require("../util/discordResponse.js");

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
    const publicid = findOption(interaction, "publicid") || "";
    const sort = findOption(interaction, "sort");
    const hide = findOption(interaction, "hide") ?? false;
    const piechart = findOption(interaction, "piechart");
    // check for invalid publicID
    if (!userLinkCheck(publicid)) return response(invalidPublicID);
    const userID = userLinkExtract(publicid);
    // fetch
    const subreq = await Promise.race([getUserStats(userID), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => embedResponse(formatUserStats(userID, data, sort, piechart), hide);
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
