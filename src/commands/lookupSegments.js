const { InteractionResponseType } = require("discord-interactions");
const { findVideoID } = require("../util/parseUrl.js");
const { videoIDNotFound } = require("../util/invalidResponse.js");
const { getSkipSegments } = require("../util/min-api.js");
// eslint-disable-next-line quotes
const ALLCATEGORIES = `["sponsor", "intro", "outro", "selfpromo", "interaction", "music_offtopic", "preview"]`;

module.exports = {
  type: 3,
  name: "Lookup Segments",
  execute: async ({ interaction, response }) => {
    // parse videoid from description
    const known = interaction.data.resolved.messages;
    const msg = Object.values(known)[0].content;
    const videoID = findVideoID(msg);
    if (!videoID) return response(videoIDNotFound);
    // fetch
    const body = await getSkipSegments(videoID, `categories=${ALLCATEGORIES}`);
    const stringified = (body === "Not Found" ? body : JSON.stringify(JSON.parse(body), null, 4));
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "```json\n"+stringified+"```",
        flags: 64
      }
    });
  }
};
