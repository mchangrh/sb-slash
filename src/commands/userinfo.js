const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const BASEURL = "https://sponsor.ajay.app/api";
const sbcutil = require("../util/sbc-util.js");
const { formatUser } = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID } = require("../util/invalidResponse.js");

module.exports = {
  name: "userinfo",
  description: "retreives user info",
  options: [
    {
      name: "publicid",
      description: "Public User ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid publicID
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
        components: userComponents(publicid, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
