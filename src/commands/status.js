const { InteractionResponseType } = require("discord-interactions");
const { formatStatus } = require("../util/formatResponse.js");
const { getStatus } = require("../util/min-api.js");
const { hideOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "status",
  description: "Get server status",
  options: [ hideOption ],
  // eslint-disable-next-line no-unused-vars
  execute: async ({ interaction, response }) => {
    let hide = false;
    if ("options" in interaction.data) {
      hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value || false;
    }
    // fetch
    const statusRes = await getStatus();
    const embed = await formatStatus(statusRes);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
