const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");
const sbcutil = require("../util/sbc-util.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound } = require("../util/invalidResponse.js");

module.exports = {
  name: "lookupsegment",
  execute: async ({ interaction, response }) => {
    const segmentid = interaction.message.content.match(/(?:\*\*Last Submission:\*\*) `([a-f0-9]{64})/)[1];
    if (!sbcutil.isValidSegmentUUID(segmentid)) return response(invalidSegment);
    // fetch
    const parsed = await getSegmentInfo(segmentid)
      .then((res) => JSON.parse(res)[0]);
    if (parsed === null) return response(segmentNotFound);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatSegment(parsed),
        components: segmentComponents(parsed.videoID, true),
        flags: InteractionResponseFlags.EPHEMERAL
      }
    });
  }
};
