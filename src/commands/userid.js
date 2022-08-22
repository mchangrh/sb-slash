const { getUserID, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatUserID } = require("../util/formatResponse.js");
const { usernameNotFound, timeoutResponse } = require("../util/invalidResponse.js");
const { hideOption, findOption } = require("../util/commandOptions.js");
const { contentResponse, embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "userid",
  description: "Get ID from username",
  options: [
    {
      name: "username",
      description: "Username",
      type: 3,
      required: true
    }, {
      name: "exact",
      description: "Search for exact username",
      type: 5,
      required: false
    }, hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const username = findOption(interaction, "username");
    const exact = findOption(interaction, "exact");
    const hide = findOption(interaction, "hide") ?? false;
    // fetch
    const subreq = await Promise.race([getUserID(username, exact), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      return response(embedResponse(formatUserID(result.data), hide));
    } else {
      // error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        return response(usernameNotFound);
      } else {
        return response(contentResponse(result.error));
      }
    }
  }
};
