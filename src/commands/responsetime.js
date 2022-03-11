const { formatResponseTime } = require("../util/formatResponse.js");
const { getResponseTime } = require("../util/min-api.js");
const { hideOption, findOption } = require("../util/commandOptions.js");

module.exports = {
  name: "responsetime",
  description: "Get server response time",
  options: [hideOption],
  execute: async ({ interaction, response }) => {
    const hide = (("options" in interaction.data) && findOption(interaction, "hide") || false);
    const data = await getResponseTime();
    return response({
      type: 4,
      data: {
        embeds: [formatResponseTime(data)],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
