const { contentResponse, formatAutomodInfo } = require("../util/formatResponse.js");
const { sendAutoMod } = require("../util/automod.js");
const { videoIDOptional, videoIDOption } = require("../util/commandOptions.js");
const { info } = require("../util/automod_api.js");

module.exports = {
  name: "automod",
  description: "Get segment suggestion from SponsorBlock ML",
  options: [{
    name: "get",
    description: "Get segment suggestion",
    type: 1,
    options: [videoIDOptional,{
      name: "category",
      description: "Category to get suggestions for",
      type: 3,
      required: false,
      choices: [{
        name: "Sponsor", value: "sponsor"
      }, {
        name: "Unpaid/ Self Promotion", value: "selfpromo"
      }, {
        name: "Interaction Reminder", value: "interaction"
      }]
    }, {
      name: "batch",
      description: "Specify batch",
      type: 3,
      required: false
    }]
  }, {
    name: "share",
    description: "Share segment suggestion",
    type: 1,
    options: [videoIDOption]
  }, {
    name: "info",
    description: "Get database stats",
    type: 1
  }, {
    name: "acceptterms",
    description: "Accept terms",
    type: 1
  }],
  execute: async ({ interaction, response }) => {
    const rootOptions = interaction.data.options[0];
    const findNestedOption = (name) => (rootOptions?.options.find((opt) => opt.name === name))?.value;
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
        const video_id = findNestedOption("videoid");
        const category = findNestedOption("category");
        const batch = findNestedOption("batch");
        const message = await sendAutoMod({edit: false, video_id, category, batch});
        return response(message);
      } else {
        return response(contentResponse("You are not allowlisted for automod - run /automod acceptterms", true));
      }
    } else if (cmdName === "share") {
      const allowList = await NAMESPACE.get("ml_allow", { type: "json" });
      if (allowList.allow.includes(dID)) {
        const video_id = findNestedOption("videoid");
        const message = await sendAutoMod({edit: false, video_id });
        delete message.data?.components;
        message.data.flags = 0;
        return response(message);
      } else {
        return response(contentResponse("You are not allowlisted for automod - run /automod acceptterms", true));
      }
    } else if (cmdName === "info") {
      const data = await info().then((res) => res.json());
      const embed = await formatAutomodInfo(data);
      return response({
        type: 4,
        data: {
          embeds: [embed]
        }
      });
    }
  }
};
