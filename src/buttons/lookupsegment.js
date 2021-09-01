const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");
const { isValidSegmentUUID } = require("../util/sbc-util.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound } = require("../util/invalidResponse.js");
const { getSegmentInfo } = require("../util/min-api.js");

module.exports = {
  name: "lookupsegment",
  execute: async ({ interaction, response }) => {
    const segmentid = interaction.message.content.match(/(?:\*\*Last Submission:\*\*) `([a-f0-9]{64,65})`/)[1];
    if (!isValidSegmentUUID(segmentid)) return response(invalidSegment);
    // fetch
    const parsed = await getSegmentInfo(segmentid);
    if (parsed[0] === null) return response(segmentNotFound);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatSegment(parsed[0]),
        components: segmentComponents(parsed[0].videoID, true),
        flags: InteractionResponseFlags.EPHEMERAL
      }
    });
  }
};
