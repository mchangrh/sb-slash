const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { noStoredID } = require("../util/invalidResponse.js");
const { getUserInfo, TIMEOUT } = require("../util/min-api.js");
const { getSBID } = require("../util/cfkv.js");
const { handleResponse } = require("../util/handleResponse.js");
const { componentResponse } = require("../util/discordResponse.js");

module.exports = {
  type: 2, // user command
  name: "Lookup userinfo",
  execute: async ({ interaction, response }) => {
    const targetID = interaction.data.target_id;
    // no publicID, we are only searching by SBID
    const SBID = await getSBID(targetID);
    if (!SBID) return response(noStoredID);
    // fetch
    const subreq = await Promise.race([getUserInfo(SBID), scheduler.wait(TIMEOUT)]);
    const successFunc = async (data) => {
      const timeSubmitted = await getLastSegmentTime(data.lastSegmentID);
      return response(componentResponse(
        formatUser(data, timeSubmitted),
        userComponents(SBID, timeSubmitted == null),
        true
      ));
    };
    return await handleResponse(successFunc, subreq, true);
  }
};
