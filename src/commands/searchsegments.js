const { getSearchSegments, timeout } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { videoIDOption, hideOption, findOption, findOptionString } = require("../util/commandOptions.js");
const { invalidVideoID, timeoutResponse } = require("../util/invalidResponse.js");
const [ INTEGER, BOOLEAN ] = [4, 5];

module.exports = {
  name: "searchsegments",
  description: "Get All Segments on Video",
  options: [
    videoIDOption, {
      name: "page",
      description: "Page of response",
      type: INTEGER
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
      description: "Minimum Vote Threshold",
      type: INTEGER
    }, {
      name: "maxviews",
      description: "Maximum Vote Threshold",
      type: INTEGER
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
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = findOptionString(interaction, "videoid");
    const page = findOption(interaction, "page") || 0;
    const hide = findOption(interaction, "hide");
    const json = findOption(interaction, "json");
    // construct URL with filters
    const filterObj = {
      minVotes: findOption(interaction, "minVotes"),
      maxVotes: findOption(interaction, "maxVotes"),
      minViews: findOption(interaction, "minViews"),
      maxViews: findOption(interaction, "maxViews"),
      locked: findOption(interaction, "locked"),
      hidden: findOption(interaction, "hidden"),
      ignored: findOption(interaction, "ignored")
    };
    let paramString = "";
    for (const [key, value] of Object.entries(filterObj)) {
      if (value) paramString += `&${key}=${value}`;
    }
    // check for video ID - if not stricly videoID, then try searching, then return original text if not found
    videoID = findVideoID(videoID) || videoID;
    if (!videoID) return response(invalidVideoID);
    // fetch
    const body = await Promise.race([getSearchSegments(videoID, page, paramString), timeout]);
    if (!body) return response(timeoutResponse);
    const responseTemplate = {
      type: 4,
      data: { flags: (hide ? 64 : 0) }
    };
    if (json) {
      const stringified = (body === "Not Found" ? body : JSON.stringify(JSON.parse(body), null, 4));
      responseTemplate.data.content = "```json\n"+stringified+"```";
    } else {
      responseTemplate.data.embeds = [formatSearchSegments(videoID, body)];
    }
    return response(responseTemplate);
  }
};
