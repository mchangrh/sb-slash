const { findVideoID, findSblookupSegment } = require("../util/validation.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");
const { getSkipSegments, getSegmentInfo } = require("../util/min-api.js");
const { formatSkipSegments } = require("../util/formatResponse.js");
const { CATEGORIES_STRING } = require("../util/categories.js");

module.exports = {
  type: 3, // message command
  name: "Lookup Segments",
  execute: async ({ interaction, response }) => {
    // parse videoid from description
    const msg = Object.values(interaction.data.resolved.messages)[0];
    const searchEmbed = msg.embeds[0] || {};
    const searchString = msg.content || searchEmbed.title || searchEmbed.description || "";
    const segmentUUID = findSblookupSegment(searchString);
    // query the video ID from the segment UUID, if one was found
    const segmentData = segmentUUID !== null ? await getSegmentInfo(segmentUUID) : [];
    const videoID = segmentData[0]?.videoID ?? findVideoID(searchString);
    if (!videoID) return response(videoIDNotFound);
    // fetch
    const body = await getSkipSegments(videoID, CATEGORIES_STRING);
    const embed = formatSkipSegments(videoID, body);
    return response({
      type: 4,
      data: {
        embeds: [embed],
        flags: 64
      }
    });
  }
};
