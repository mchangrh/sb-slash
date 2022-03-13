const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, timeoutResponse, noOptions, notVIP } = require("../util/invalidResponse.js");
const { getUserInfo, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract, userStrictCheck } = require("../util/validation.js");
const { publicIDOptionOptional, userOptionOptional, hideOption, findOption, findOptionString } = require("../util/commandOptions.js");
const { getSBID, checkVIP } = require("../util/cfkv.js");
const { contentResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "userinfo",
  description: "retrieves user info",
  options: [
    publicIDOptionOptional,
    userOptionOptional,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // check for no options
    if (!interaction.data.options) return response(noOptions);
    // get params from discord
    const publicid = findOptionString(interaction, "publicid");
    const user = findOption(interaction, "user");
    const hide = findOption(interaction, "hide") ?? false;
    if (user && !checkVIP(interaction?.member?.roles)) return response(notVIP);
    // only hide command
    if (!publicid && !user) return response(noOptions);
    // invalid publicID
    if (!userStrictCheck(publicid) && !userLinkCheck(publicid) && !user) return response(invalidPublicID);
    const SBID = await getSBID(user);
    // lookup
    const userID = (user && !publicid) ? SBID
      : userStrictCheck(publicid) ? publicid
        : userLinkExtract(publicid);
    if (!userID) return response(invalidPublicID);
    // fetch
    const subreq = await Promise.race([getUserInfo(userID), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) { // no request errors
      // get last segment time
      const timeSubmitted = await getLastSegmentTime(result.data.lastSegmentID);
      return response({
        type: 4,
        data: {
          embeds: [formatUser(result.data, timeSubmitted)],
          components: userComponents(userID, false),
          flags: (hide ? 64 : 0)
        }
      });
    } else { // handle error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else {
        return response(contentResponse(result.error), true);
      }
    }
  }
};
