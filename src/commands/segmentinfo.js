const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const sbcutil = require("../util/sbc-util.js");
const BASEURL = "https://sponsor.ajay.app/api";
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment } = require("../util/invalidResponse.js");

module.exports = {
  name: "segmentinfo",
  description: "retreives segment info",
  options: [
    {
      name: "segmentid",
      description: "UUID of segment to look up",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const segmentid = ((interaction.data.options.find((opt) => opt.name === "segmentid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid segmentid
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
        components: segmentComponents(parsed.videoID, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
