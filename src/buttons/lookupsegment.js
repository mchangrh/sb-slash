const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound } = require("../util/invalidResponse.js");
const { getSegmentInfo } = require("../util/min-api.js");

module.exports = {
  name: "lookupsegment",
  execute: async ({ interaction, response }) => {
    const prevContent = interaction.message.content || interaction.message.embeds[0].description;
    const segmentid = prevContent.match(/\*\*Last Submission:\*\* <t:\d+:R>\s+`([a-f0-9]{64,65})`/)[1];
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const parsed = await getSegmentInfo(segmentid);
    if (parsed[0] === null) return response(segmentNotFound);
    return response({
      type: 4,
      data: {
        embeds: [formatSegment(parsed[0])],
        components: segmentComponents(parsed[0].videoID, true),
        flags: 64
      }
    });
  }
};
