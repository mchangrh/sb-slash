const { findVideoID, findSegmentUUID } = require("../util/validation.js");
const { videoIDNotFound, timeoutResponse } = require("../util/invalidResponse.js");
const { getSearchSegments, getSegmentInfo, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatSearchSegments, segmentsNotFoundEmbed } = require("../util/formatResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");
const { contentResponse, embedResponse, componentResponse } = require("../util/discordResponse.js");

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
    // fetch
    const subreq = await Promise.race([getSearchSegments(videoID, 0, ""), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) {
      return response(componentResponse(
        formatSearchSegments(videoID, result.data),
        searchSegmentsComponents(result.data))
      );
    } else if (result.error === "timeout") { // error responses
      return response(timeoutResponse);
    } else if (result.code === 404 ) {
      return response(
        embedResponse(segmentsNotFoundEmbed(videoID))
      );
    } else {
      return response(contentResponse(result.error));
    }
  }
};
