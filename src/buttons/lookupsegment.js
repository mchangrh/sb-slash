const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound } = require("../util/invalidResponse.js");
const { getSegmentInfo, getUserInfo } = require("../util/min-api.js");

module.exports = {
  name: "lookupsegment",
  execute: async ({ interaction, response }) => {
    const segmentid = interaction.message.content.match(/(?:\*\*Last Submission:\*\*) `([a-f0-9]{64,65})`/)[1];
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const parsed = await getSegmentInfo(segmentid);
    if (parsed[0] === null) return response(segmentNotFound);
    const user = await getUserInfo(parsed[0].userID);
    return response({
      type: 4,
      data: {
        embeds: [formatSegment(parsed[0], user)],
        components: segmentComponents(parsed[0].videoID, true),
        flags: 64
      }
    });
  }
};
