const youtubeURLRegex = new RegExp(/(?:https:\/\/(?:|(?:www.)))((?:youtu.be\/)|(?:youtube.com\/watch\?v=))([0-9A-Za-z_-]{11})(?:(?:(?:\?|&)t=\d+)|)/, "g");
// for some reason splitting up the regex breaks it, so... here we are

module.exports = {
  type: 3, // message command
  name: "Replace with sb.ltn.fi links",
  execute: async ({ interaction, response }) => {
    // get message contents
    const msg = Object.values(interaction.data.resolved.messages)[0];
    return response({
      type: 4,
      data: {
        content: msg.content.replace(youtubeURLRegex, "https://sb.ltn.fi/video/$2")
      }
      // flags: 64 // don't hide response
    });
  }
};
