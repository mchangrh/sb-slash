const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");

exports.invalidSegment = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid segment ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

exports.invalidPublicID = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid public User ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

exports.segmentNotFound = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, there doesn't seem to be any segments with that ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};
