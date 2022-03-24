const { getSearchSegments, TIMEOUT } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { videoIDRequired, hideOption, findOption } = require("../util/commandOptions.js");
const { invalidVideoID } = require("../util/invalidResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");
const [ INTEGER, BOOLEAN ] = [4, 5];
const { handleResponse } = require("../util/handleResponse.js");
const { componentResponse } = require("../util/discordResponse.js");

const searchSegmentOptions = [
  videoIDRequired, {
    name: "page",
    description: "Page of response",
    type: INTEGER,
    min_value: 1
  }, {
    name: "minvotes",
    description: "Minimum Vote Threshold",
    type: INTEGER
  }, {
    name: "maxvotes",
    description: "Maximum Vote Threshold",
    type: INTEGER
  }, {
    name: "minviews",
    description: "Minimum Views Threshold",
    type: INTEGER,
    min_value: 0
  }, {
    name: "maxviews",
    description: "Maximum Views Threshold",
    type: INTEGER,
    min_value: 0
  }, {
    name: "locked",
    description: "include locked segments",
    type: BOOLEAN
  }, {
    name: "hidden",
    description: "include hidden segments",
    type: BOOLEAN
  }, {
    name: "ignored",
    description: "include ignored segments (hidden or downvoted)",
    type: BOOLEAN
  }, {
    name: "json",
    description: "return response as JSON",
    type: BOOLEAN
  },
  hideOption
];

module.exports = {
  name: "searchsegments",
  description: "Get All Segments on Video",
  options: searchSegmentOptions,
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = findOption(interaction, "videoid") || "";
    const page = findOption(interaction, "page")-1 || 0;
    const hide = findOption(interaction, "hide") ?? false;
    // construct URL with filters
    const filterObj = {
      minVotes: findOption(interaction, "minvotes"),
      maxVotes: findOption(interaction, "maxvotes"),
      minViews: findOption(interaction, "minviews"),
      maxViews: findOption(interaction, "maxviews"),
      locked:   findOption(interaction, "locked"),
      hidden:   findOption(interaction, "hidden"),
      ignored:  findOption(interaction, "ignored")
    };
    let paramString = "";
    for (const [key, value] of Object.entries(filterObj)) {
      if (value) paramString += `&${key}=${value}`;
    }
    // check for video ID - if not stricly videoID, then try searching, then return original text if not found
    videoID = findVideoID(videoID);
    if (!videoID) return response(invalidVideoID);
    // fetch
    const subreq = await Promise.race([getSearchSegments(videoID, page, paramString), scheduler.wait(TIMEOUT)]);
    const successFunc = (data) => componentResponse(
      formatSearchSegments(videoID, data, {...filterObj, page, videoID}),
      searchSegmentsComponents(data),
      hide
    );
    const result = await handleResponse(successFunc, subreq);
    return response(result);
  }
};
