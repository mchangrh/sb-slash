const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound, timeoutResponse, userNoSegments } = require("../util/invalidResponse.js");
const { getSegmentInfo, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { contentResponse } = require("../util/discordResponse");

module.exports = {
  name: "lookupsegment",
  execute: async ({ interaction, response }) => {
    const prevContent = interaction.message.content || interaction.message.embeds[0].description;
    const match = prevContent.match(/\*\*Last Submission:\*\* <t:\d+:R>\s+`([a-f0-9]{64,65})`/);
    if (match === null) {
      return response(userNoSegments);
    }
    const segmentid = match[1];
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const subreq = await Promise.race([getSegmentInfo(segmentid), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      return response({
        type: 4,
        data: {
          embeds: [formatSegment(result.data[0])],
          components: segmentComponents(result.data[0].videoID, true),
          flags: 64
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
