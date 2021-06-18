const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");
const { isValidUserUUID } = require("../util/sbc-util.js");
const { formatUser } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID } = require("../util/invalidResponse.js");

module.exports = {
  name: "lookupuser",
  execute: async ({ interaction, response }) => {
    const publicid = interaction.message.content.match(/(?:\*\*User ID:\*\*) `([a-f0-9]{64})`/)[1];
    if (!isValidUserUUID(publicid)) return response(invalidPublicID);
    // fetch
    const parsedUser = await getUserInfo(publicid)
      .then((res) => JSON.parse(res));
    const segmentParse = await getSegmentInfo(parsedUser.lastSegmentID)
      .then((res) => JSON.parse(res)[0]) ;
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatUser(parsedUser, segmentParse.timeSubmitted),
        components: userComponents(publicid, true),
        flags: InteractionResponseFlags.EPHEMERAL
      }
    });
  }
};
