const { formatStatus } = require("../util/formatResponse.js");
const { timeoutResponse } = require("../util/invalidResponse.js");
const { getStatus, TIMEOUT } = require("../util/min-api.js");
const { hideOption, findOption } = require("../util/commandOptions.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "status",
  description: "Get server status",
  options: [hideOption],
  execute: async ({ interaction, response }) => {
    const hide = (("options" in interaction.data) && findOption(interaction, "hide") || false);
    // fetch
    const statusRes = await Promise.race([getStatus(), scheduler.wait(TIMEOUT)]);
    if (!statusRes) return response(timeoutResponse);
    const embed = await formatStatus(statusRes);
    return response(embedResponse(embed, hide));
  }
};
