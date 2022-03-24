const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, noOptions, noStoredID } = require("../util/invalidResponse.js");
const { getUserInfo, TIMEOUT } = require("../util/min-api.js");
const { userLinkCheck, userLinkExtract, userStrictCheck } = require("../util/validation.js");
const { publicIDOptionOptional, userOptionOptional, hideOption, findOption } = require("../util/commandOptions.js");
const { getSBID } = require("../util/cfkv.js");
const { handleResponse } = require("../util/handleResponse.js");
const { componentResponse } = require("../util/discordResponse.js");

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
    // invalid publicID & no user
    if (!userStrictCheck(publicid) && !userLinkCheck(publicid) && !user) return response(invalidPublicID);
    // no publicID, we are only searching by SBID
    const SBID = await getSBID(user);
    if (user && !publicid) {
      if (!SBID) return response(noStoredID);
    }
    // lookup
    const userID = (user && !publicid) ? SBID
      : userStrictCheck(publicid) ? publicid
        : userLinkExtract(publicid);
    // fetch
    const subreq = await Promise.race([getUserInfo(userID), scheduler.wait(TIMEOUT)]);
    const successFunc = async (data) => {
      const timeSubmitted = await getLastSegmentTime(data.lastSegmentID);
      return response(componentResponse(
        formatUser(data, timeSubmitted),
        userComponents(userID, false),
        hide
      ));
    };
    return await handleResponse(successFunc, subreq, hide);
  }
};
