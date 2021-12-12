const { getUserID, timeout } = require("../util/min-api.js");
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
    },
    {
      name: "exact",
      description: "search for exact username",
      type: 5,
      required: false
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const username = findOptionString(interaction, "username");
    const exact = findOption(interaction, "exact");
    const hide = findOption(interaction, "hide");
    // fetch
    const res = await Promise.race([getUserID(username, exact), timeout]);
    if (!res) return response(timeoutResponse);
    // check for responses
    if (res.status === 404) return response(usernameNotFound);
    return response({
      type: 4,
      data: {
        embeds: [formatUserID(await res.json())],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
