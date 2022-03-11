const { getUserID, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatUserID } = require("../util/formatResponse.js");
const { usernameNotFound, timeoutResponse } = require("../util/invalidResponse.js");
const { hideOption, findOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "userid",
  description: "get ID from username",
  options: [
    {
      name: "username",
      description: "username",
      type: 3,
      required: true
    }, {
      name: "exact",
      description: "search for exact username",
      type: 5,
      required: false
    }, hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const username = findOptionString(interaction, "username");
    const exact = findOption(interaction, "exact");
    const hide = findOption(interaction, "hide");
    // fetch
    const subreq = await Promise.race([getUserID(username, exact), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      return response({
        type: 4,
        data: {
          embeds: [formatUserID(result.data)],
          flags: (hide ? 64 : 0)
        }
      });
    } else {
      // error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        return response(usernameNotFound);
      } else {
        return response(defaultResponse(result.error));
      }
    }
  }
};
