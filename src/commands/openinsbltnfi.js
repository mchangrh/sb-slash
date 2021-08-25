const { InteractionResponseType } = require("discord-interactions");
const { findVideoID } = require("../util/parseUrl.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");

module.exports = {
  type: 3,
  name: "Open in sb.ltn.fi",
  execute: async ({ interaction, response }) => {
    // parse videoid from description
    const known = interaction.data.resolved.messages;
    const msg = Object.values(known)[0].content;
    const videoID = findVideoID(msg);
    if (!videoID) return response(videoIDNotFound);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `https://sb.ltn.fi/video/${videoID}`,
        flags: 64
      }
    });
  }
};
