const youtubeURLRegex = new RegExp(/(?:https:\/\/(?:|(?:www.)))((?:youtu.be\/)|(?:youtube.com\/watch\?v=))([0-9A-Za-z_-]{11})(?:(?:(?:\?|&)t=\d+)|)/, "g");
// for some reason splitting up the regex breaks it, so... here we are
const { contentResponse } = require("../util/discordResponse.js");

module.exports = {
  type: 3, // message command
  name: "Replace with sb.ltn.fi links",
  execute: ({ interaction, response }) => {
    // get message contents
    const msgContent = Object.values(interaction.data.resolved.messages)[0]?.content;
    return response(contentResponse(msgContent.replace(youtubeURLRegex, "https://sb.ltn.fi/video/$2")), true);
  }
};
