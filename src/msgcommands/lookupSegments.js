const { findVideoID, findSegmentUUID } = require("../util/validation.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");
const { getSearchSegments, getSegmentInfo } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { noSegments } = require("../util/invalidResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");

module.exports = {
  type: 3, // message command
  name: "Lookup Segments",
  execute: async ({ interaction, response }) => {
    // parse videoid from description
    const msg = Object.values(interaction.data.resolved.messages)[0];
    const searchEmbed = msg.embeds[0] || {};
    const searchString = msg.content || searchEmbed.title || searchEmbed.description || "";
    const segmentUUID = findSegmentUUID(searchString);
    // query the video ID from the segment UUID, if one was found
    const segmentData = segmentUUID ? await getSegmentInfo(segmentUUID) : null;
    const videoID = segmentData ? segmentData[0].videoID : findVideoID(searchString);
    if (!videoID) return response(videoIDNotFound);
    // fetch
    const body = await getSearchSegments(videoID, 0, "");
    if (body == "Not Found") return response(noSegments);
    return response({
      type: 4,
      data: {
        embeds: [formatSearchSegments(videoID, body, {page: 0, videoID})],
        flags: 64,
        components: searchSegmentsComponents(body)
      }
    });
  }
};
