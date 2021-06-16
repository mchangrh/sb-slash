const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");
const BASEURL = "https://sponsor.ajay.app/api";
const sbcutil = require("../util/sbc-util.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment } = require("../util/invalidResponse.js");

module.exports = {
  name: "lookupsegment",
  execute: async ({ interaction, response }) => {
    const segmentid = interaction.message.content.match(/(?:\*\*Last Submission:\*\*) `([a-f0-9]{64})/)[1];
    if (!sbcutil.isValidSegmentUUID(segmentid)) return response(invalidSegment);
    // construct url
    const url = `${BASEURL}/segmentInfo?UUID=${segmentid}`;
    // fetch
    let res = await fetch(url);
    let body = await res.text();
    const parsed = JSON.parse(body)[0];
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
