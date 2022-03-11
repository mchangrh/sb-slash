const { findVideoID, findSegmentUUID } = require("../util/validation.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");
const { getSearchSegments, getSegmentInfo, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");

module.exports = {
  type: 3, // message command
  name: "Lookup Segments",
  execute: async ({ interaction, response }) => {
    // parse videoid from description
    const msg = Object.values(interaction.data.resolved.messages)[0];
    const searchString = msg.content || msg.embeds?.[0]?.title || msg.embeds?.[0]?.description || "";
    const segmentUUID = findSegmentUUID(searchString);
    // query the video ID from the segment UUID, if one was found
    const segmentData = segmentUUID ? await getSegmentInfo(segmentUUID) : null;
    const videoID = segmentData?.[0].videoID || findVideoID(searchString);
    if (!videoID) return response(videoIDNotFound);
    // setup
    const responseEmbed = {
      type: 4, data: { flags: 64 }
    };
    // fetch
    const subreq = await Promise.race([getSearchSegments(videoID, 0, ""), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      return response({
        ...responseEmbed,
        data: {
          embeds: [formatSearchSegments(body)],
          components: searchSegmentsComponents(body)
        }
      });
    } else {
      // error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        return response({
          ...responseEmbed,
          data: { embeds: [segmentsNotFoundEmbed(videoID)] }
        });
      } else {
        return response(defaultResponse(result.error));
      }
    }
  }
};
