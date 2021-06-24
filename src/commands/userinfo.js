const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { isValidUserUUID } = require("../util/sbc-util.js");
const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfo } = require("../util/min-api.js");

module.exports = {
  name: "userinfo",
  description: "retreives user info",
  options: [
    {
      name: "publicid",
      description: "Public User ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid publicID
    if (!isValidUserUUID(publicid)) return response(invalidPublicID);
    // fetch
    const parsedUser = await getUserInfo(publicid)
      .then((res) => JSON.parse(res));
    // get last segment time
    const timeSubmitted = await getLastSegmentTime(parsedUser.lastSegmentID);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatUser(parsedUser, timeSubmitted),
        components: userComponents(publicid, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
