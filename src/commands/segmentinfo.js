const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound, timeoutResponse } = require("../util/invalidResponse.js");
const { getSegmentInfo, getUserInfo, timeout } = require("../util/min-api.js");
const { hideOption, segmentIDOption, findOption, findOptionString } = require("../util/commandOptions.js");

module.exports = {
  name: "segmentinfo",
  description: "retrieves segment info",
  options: [
    segmentIDOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const segmentid = findOptionString(interaction, "segmentid");
    const hide = findOption(interaction, "hide");
    // check for invalid segmentid
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const parsed = await Promise.race([getSegmentInfo(segmentid), timeout]);
    if (!parsed) return response(timeoutResponse);
    if (parsed[0] === null) return response(segmentNotFound);
    const user = await getUserInfo(parsed[0].userID);
    return response({
      type: 4,
      data: {
        embeds: [formatSegment(parsed[0], user)],
        components: segmentComponents(parsed[0].videoID, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
