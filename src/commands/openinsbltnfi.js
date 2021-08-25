const { InteractionResponseType } = require("discord-interactions");
const { findVideoID } = require("../util/parseUrl.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");

module.exports = {
  type: 3, // message command
  name: "Open in sb.ltn.fi",
  execute: async ({ interaction, response }) => {
    // parse videoid from description
    const msg = Object.values(interaction.data.resolved.messages)[0];
    const searchString = (msg.content) ? msg.content : msg.embeds[0].title;
    const videoID = findVideoID(searchString);
    if (!videoID) return response(videoIDNotFound);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `https://sb.ltn.fi/video/${videoID}/`,
        flags: 64
      }
    });
  }
};
