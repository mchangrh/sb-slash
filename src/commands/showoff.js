const { formatShowoff } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfoShowoff, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { publicIDOptionRequired, findOption } = require("../util/commandOptions.js");
const { handleResponse } = require("../util/handleResponse.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "showoff",
  description: "Show off your stats",
  options: [ publicIDOptionRequired ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = findOption(interaction, "publicid");
    // check for invalid publicID
    if (!userLinkCheck(publicid)) return response(invalidPublicID);
    const userID = userLinkExtract(publicid);
    // fetch
    const subreq = await Promise.race([getUserInfoShowoff(userID), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => embedResponse(formatShowoff(userID, data), false);
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
