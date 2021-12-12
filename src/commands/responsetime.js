const { formatResponseTime } = require("../util/formatResponse.js");
const { timeoutResponse } = require("../util/invalidResponse.js");
const { getResponseTime, timeout } = require("../util/min-api.js");
const { hideOption, findOption } = require("../util/commandOptions.js");

module.exports = {
  name: "responsetime",
  description: "Get server response time",
  options: [ hideOption ],
  execute: async ({ interaction, response }) => {
    const hide = (("options" in interaction.data) && findOption(interaction, "hide") || false);
    // fetch
    const responseRes = await Promise.race([getResponseTime(), timeout]);
    if (!responseRes) return response(timeoutResponse);
    const embed = formatResponseTime(responseRes);
    console.log(embed);
    return response({
      type: 4,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
