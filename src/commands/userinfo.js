const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, noOptions } = require("../util/invalidResponse.js");
const { getUserInfo, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract, userStrictCheck } = require("../util/validation.js");
const { publicIDOptionOptional, userOptionOptional, hideOption, findOption } = require("../util/commandOptions.js");
const { getSBID } = require("../util/cfkv.js");
const { handleResponse } = require("../util/handleResponse.js");

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
    const publicid = findOption(interaction, "publicid") || "";
    const user = findOption(interaction, "user");
    const hide = findOption(interaction, "hide") ?? false;
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
    const successFunc = async (data) => {
      const timeSubmitted = await getLastSegmentTime(data.lastSegmentID);
      return response({
        type: 4,
        data: {
          embeds: [formatUser(data, timeSubmitted)],
          components: userComponents(userID, false),
          flags: (hide ? 64 : 0)
        }
      });
    };
    return await handleResponse(successFunc, subreq, hide);
  }
};
