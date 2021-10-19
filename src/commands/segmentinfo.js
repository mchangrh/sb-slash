const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound } = require("../util/invalidResponse.js");
const { getSegmentInfo } = require("../util/min-api.js");
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
    const parsed = await getSegmentInfo(segmentid);
    if (parsed[0] === null) return response(segmentNotFound);
    return response({
      type: 4,
      data: {
        embeds: [formatSegment(parsed[0])],
        components: segmentComponents(parsed[0].videoID, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
