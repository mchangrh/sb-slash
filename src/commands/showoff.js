const { formatShowoff } = require("../util/formatResponse.js");
const { invalidPublicID, timeoutResponse } = require("../util/invalidResponse.js");
const { getUserInfoShowoff, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { publicIDOptionRequired } = require("../util/commandOptions.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

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
    const result = await responseHandler(subreq);
    if (result.success) { // no request errors
      return response(embedResponse(formatShowoff(userID, result.data), false));
    } else { // handle error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else {
        return response(contentResponse(result.error), true);
      }
    }
  }
};
