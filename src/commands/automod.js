const format = require("../util/formatResponse.js");
const { sendAutoMod } = require("../util/automod.js");
const { videoIDOptional } = require("../util/commandOptions.js");

const findNestedOption = (rootOptions, name) => (rootOptions?.options.find((opt) => opt.name === name))?.value;

module.exports = {
  name: "automod",
  description: "Get segment suggestion from SponsorBlock ML",
  options: [{
    name: "get",
    description: "Get segment suggestion",
    type: 1,
    options: [videoIDOptional]
  }, {
    name: "acceptterms",
    description: "Accept terms",
    type: 1
  }],
  execute: async ({ interaction, response }) => {
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const dID = interaction?.member?.user.id || interaction.user.id;
    if (cmdName === "acceptterms") {
      return response({
        type: 4,
        data: {
          content: "Please read over the disclaimers regarding [Automating Submissions](https://wiki.sponsor.ajay.app/w/Automating_Submissions). Your publicID will be allowlisted",
          flags: 64,
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "Continue",
              style: 1,
              custom_id: "automod_deny"
            }, {
              type: 2,
              label: "I have read over the disclaimers",
              style: 4,
              custom_id: "automod_accept"
            }]
          }]
        }
      });
    } else if (cmdName === "get") {
      const allowList = await NAMESPACE.get("ml_allow", { type: "json" });
      if (allowList.allow.includes(dID)) {
        const videoID = findNestedOption(rootOptions, "videoid")?.value;
        const message = await sendAutoMod(false, videoID);
        return response(message);
      } else {
        return response(format.contentResponse("You are not allowlisted for automod - run /automod acceptterms", true));
      }
    }
  }
};