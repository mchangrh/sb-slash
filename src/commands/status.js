const { InteractionResponseType } = require("discord-interactions");
const { formatStatus } = require("../util/formatResponse.js");
const { getStatus } = require("../util/min-api.js");

module.exports = {
  type: 1,
  name: "status",
  description: "Get server status",
  // eslint-disable-next-line no-unused-vars
  execute: async ({ interaction, response }) => {
    // fetch
    const statusRes = await getStatus();
    const embed = await formatStatus(statusRes);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed]
      }
    });
  }
};