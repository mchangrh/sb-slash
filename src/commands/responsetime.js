const { formatResponseTime } = require("../util/formatResponse.js");
const { getResponseTime } = require("../util/min-api.js");
const { hideOption, findOption } = require("../util/commandOptions.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "responsetime",
  description: "Get server response time",
  options: [hideOption],
  execute: async ({ interaction, response }) => {
    const hide = (("options" in interaction.data) && findOption(interaction, "hide") || false);
    const data = await getResponseTime();
    return response(embedResponse(formatResponseTime(data), hide));
  }
};
