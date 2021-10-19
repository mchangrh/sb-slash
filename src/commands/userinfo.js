const { InteractionResponseType } = require("discord-interactions");
const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfo } = require("../util/min-api.js");
const { linkCheck, linkExtract } = require("../util/userUUID.js");
const { publicIDOption, hideOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "userinfo",
  description: "retrieves user info",
  options: [
    publicIDOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid publicID
    if (!linkCheck(publicid)) return response(invalidPublicID);
    const userID = linkExtract(publicid);
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
