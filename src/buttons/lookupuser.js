const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");
const BASEURL = "https://sponsor.ajay.app/api";
const sbcutil = require("../util/sbc-util.js");
const { formatUser } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID } = require("../util/invalidResponse.js");

module.exports = {
  name: "lookupuser",
  execute: async ({ interaction, response }) => {
    const publicid = interaction.message.content.match(/(?:\*\*User ID:\*\*) ([a-f0-9]{64})/)[1];
    if (!sbcutil.isValidUserUUID(publicid)) return response(invalidPublicID);
    // construct url
    const url = `${BASEURL}/userInfo?publicUserID=${publicid}`;
    // fetch
    let res = await fetch(url);
    let body = await res.text();
    const parsed = formatUser(JSON.parse(body));
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: parsed,
        components: userComponents(publicid, true),
        flags: InteractionResponseFlags.EPHEMERAL
      }
    });
  }
};
