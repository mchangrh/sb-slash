const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, timeoutResponse } = require("../util/invalidResponse.js");
const { getUserInfo, timeout } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { publicIDOption, hideOption, findOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "userinfo",
  description: "retrieves user info",
  options: [
    publicIDOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = findOptionString(interaction, "publicid");
    const hide = findOption(interaction, "hide");
    // check for invalid publicID
    if (!userLinkCheck(publicid)) return response(invalidPublicID);
    const userID = userLinkExtract(publicid);
    // fetch
    const parsedUser = await Promise.race([getUserInfo(userID), timeout]);
    if (!parsedUser) return response(timeoutResponse);
    // get last segment time
    const timeSubmitted = await getLastSegmentTime(parsedUser.lastSegmentID);
    return response({
      type: 4,
      data: {
        content: formatUser(parsedUser, timeSubmitted),
        components: userComponents(userID, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
