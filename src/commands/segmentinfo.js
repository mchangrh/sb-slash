const { segmentStrictCheck } = require("../util/validation.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment } = require("../util/invalidResponse.js");
const { getSegmentInfo, TIMEOUT } = require("../util/min-api.js");
const { hideOption, segmentIDOption, findOption } = require("../util/commandOptions.js");
const { handleResponse } = require("../util/handleResponse.js");
const { componentResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "segmentinfo",
  description: "retrieves segment info",
  options: [
    segmentIDOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const segmentid = findOption(interaction, "segmentid");
    const hide = findOption(interaction, "hide") ?? false;
    // check for invalid segmentid
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const subreq = await Promise.race([getSegmentInfo(segmentid), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => componentResponse(
      formatSegment(data[0]),
      segmentComponents(data[0].videoID, false),
      hide
    );
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
