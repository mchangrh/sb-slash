const { InteractionResponseType, InteractionResponseFlags } = require('discord-interactions');

const invalidSegment = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid segment ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
}

const invalidPublicID = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid public User ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
}

module.exports = {
  invalidSegment,
  invalidPublicID
}
