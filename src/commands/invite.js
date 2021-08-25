const { InteractionResponseType } = require("discord-interactions");

module.exports = {
  type: 1,
  name: "invite",
  description: "Get a link to invite sb-slash to your server",
  execute: async ({ response }) =>
    response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [{
          description: "Click [here](https://sb-slash.mchang.workers.dev/invite) to invite sb-slash to your server",
          color: 0xff0000
        }],
        flags: 64 // hide
      }
    })
};
