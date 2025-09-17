const { segmentStrictCheck } = require("../util/validation.js");
const { invalidSegment } = require("../util/invalidResponse.js");
const { getTrueVotes } = require("../util/sbstats.js");
const { TIMEOUT } = require("../util/min-api.js");
const { hideOption, segmentIDRequired, findOption } = require("../util/commandOptions.js");
const { handleResponse } = require("../util/handleResponse.js");
const { formatTrueVotes } = require("../util/formatResponse.js");
const { embedResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "truevotes",
  description: "Show ignored votes for a segment",
  options: [
    segmentIDRequired,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const segmentid = findOption(interaction, "segmentid");
    const hide = findOption(interaction, "hide") ?? false;
    // check for invalid segmentid
    if (!segmentStrictCheck(segmentid)) return response(invalidSegment);
    // fetch
    const subreq = await Promise.race([getTrueVotes(segmentid), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => embedResponse(
      formatTrueVotes(segmentid, data),
      hide
    );
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
