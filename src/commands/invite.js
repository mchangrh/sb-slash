const { InteractionResponseType } = require("discord-interactions");

module.exports = {
  name: "invite",
  description: "Get a link to invite sb-slash to your server",
  execute: async ({ interacion, response }) =>
    response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: {
          description: `Click [here](https://sb-slash.mchang.workers.dev/invite) to invite me to your server`
        }
      }
    })
};
