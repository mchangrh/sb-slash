const { InteractionResponseType } = require("discord-interactions");
const { getLockCategories } = require("../util/min-api.js");
const { formatLockCategories } = require("../util/formatResponse.js");
const { findVideoID, strictVideoID } = require("../util/parseUrl.js");
const { hideOption, videoIDOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "lockcategories",
  description: "retrieves video lock categories",
  options: [
    videoIDOption,
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = ((interaction.data.options.find((opt) => opt.name === "videoid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for video ID - if not strictly videoID, then try searching, then return original text if not found
    if (!strictVideoID(videoID)) {
      videoID = findVideoID(videoID) || videoID;
    }
    // fetch
    const body = await getLockCategories(videoID);
    const embed = formatLockCategories(videoID, body);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
