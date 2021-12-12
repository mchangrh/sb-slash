const { formatStatus } = require("../util/formatResponse.js");
const { timeoutResponse } = require("../util/invalidResponse.js");
const { getStatus, timeout } = require("../util/min-api.js");
const { hideOption, findOption } = require("../util/commandOptions.js");

module.exports = {
  name: "status",
  description: "Get server status",
  options: [ hideOption ],
  execute: async ({ interaction, response }) => {
    const hide = (("options" in interaction.data) && findOption(interaction, "hide") || false);
    // fetch
    const statusRes = await Promise.race([getStatus(), timeout]);
    if (!statusRes) return response(timeoutResponse);
    const embed = await formatStatus(statusRes);
    return response({
      type: 4,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
