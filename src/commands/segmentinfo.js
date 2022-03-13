const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound, timeoutResponse } = require("../util/invalidResponse.js");
const { getSegmentInfo, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { hideOption, segmentIDOption, findOption, findOptionString } = require("../util/commandOptions.js");
const { contentResponse } = require("../util/discordResponse.js");

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
    const hide = findOption(interaction, "hide") ?? false;
    // check for invalid segmentid
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const subreq = await Promise.race([getSegmentInfo(segmentid), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      return response({
        type: 4,
        data: {
          embeds: [formatSegment(result.data[0])],
          components: segmentComponents(result.data[0].videoID, false),
          flags: (hide ? 64 : 0)
        }
      });
    } else {
      // error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        return response(segmentNotFound);
      } else {
        return response(contentResponse(result.error));
      }
    }
  }
};
