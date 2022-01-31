const { findVideoID, findSegmentUUID } = require("../util/validation.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");

module.exports = {
  type: 3, // message command
  name: "Open in sb.ltn.fi",
  execute: ({ interaction, response }) => {
    // parse videoid from description
    const msg = Object.values(interaction.data.resolved.messages)[0];
    const embedTitle = (msg.embeds !== undefined && msg.embeds.length ) ? msg.embeds[0].title : "";
    const searchString = msg.content || embedTitle;
    const segmentUUID = findSegmentUUID(searchString);
    const videoID = findVideoID(searchString);
    if (!segmentUUID && !videoID) return response(videoIDNotFound);
    return response({
      type: 4,
      data: {
        content: segmentUUID !== null ? `https://sb.ltn.fi/uuid/${segmentUUID}/` : `https://sb.ltn.fi/video/${videoID}/`,
        flags: 64
      }
    });
  }
};
