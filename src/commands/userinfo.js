const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfo } = require("../util/min-api.js");

const userIDRegex = new RegExp(/(?:^|sb.ltn.fi\/userid\/)([a-f0-9]{64})/);
const hasValidUserUUID = (str) => userIDRegex.test(str);

module.exports = {
  type: 1,
  name: "userinfo",
  description: "retrieves user info",
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
    if (!hasValidUserUUID(publicid)) return response(invalidPublicID);
    const userID = publicid.match(userIDRegex)[1];
    // fetch
    const parsedUser = await getUserInfo(userID);
    // get last segment time
    const timeSubmitted = await getLastSegmentTime(parsedUser.lastSegmentID);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatUser(parsedUser, timeSubmitted),
        components: userComponents(userID, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
