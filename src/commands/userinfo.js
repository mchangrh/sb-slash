const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, timeoutResponse, noOptions, noStoredID } = require("../util/invalidResponse.js");
const { getUserInfo, timeout } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { publicIDOptionOptional, userOption, hideOption, findOption, findOptionString } = require("../util/commandOptions.js");

const getSBID = (dID) => NAMESPACE.get(dID, {cacheTtl: 86400});

module.exports = {
  name: "userinfo",
  description: "retrieves user info",
  options: [
    publicIDOptionOptional,
    userOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    if (!interaction.data.options) return response(noOptions);
    // get params from discord
    const publicid = findOptionString(interaction, "publicid");
    const user = findOption(interaction, "user");
    const hide = findOption(interaction, "hide");
    // check for invalid publicID
    if (!userLinkCheck(publicid) && !user) return response(invalidPublicID);
    const SBID = await getSBID(user);
    if (!SBID) return response(noStoredID);
    const userID = (user && !publicid) ? SBID : userLinkExtract(publicid);
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
