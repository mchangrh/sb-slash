const { formatUser, getLastSegmentTime } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, timeoutResponse } = require("../util/invalidResponse.js");
const { getUserInfo, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { userStrictCheck } = require("../util/validation.js");

module.exports = {
  name: "lookupuser",
  execute: async ({ interaction, response }) => {
    const publicid = interaction.message.embeds[0].description.match(/(?:\*\*User ID:\*\*) `([a-f0-9]{64})`/)[1];
    if (!userStrictCheck(publicid)) return response(invalidPublicID);
    // fetch
    const subreq = await Promise.race([getUserInfo(publicid), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    // get last segment time
    if (result.success) { // no request errors
      // get last segment time
      const timeSubmitted = await getLastSegmentTime(result.data.lastSegmentID);
      return response({
        type: 4,
        data: {
          embeds: [formatUser(result.data, timeSubmitted)],
          components: userComponents(userID, true),
          flags: 64
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
