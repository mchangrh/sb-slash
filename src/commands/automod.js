const { formatAutomodInfo } = require("../util/formatResponse.js");
const { sendAutoMod } = require("../util/automod.js");
const { videoIDOptional, videoIDRequired } = require("../util/commandOptions.js");
const { ml } = require("../util/automod_api.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

const autoModOptions = [{
  name: "get",
  description: "Get segment suggestion",
  type: 1,
  options: [videoIDOptional, {
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
  options: [videoIDRequired]
}, {
  name: "info",
  description: "Get database stats",
  type: 1
}, {
  name: "acceptterms",
  description: "Accept terms",
  type: 1
}];

const acceptTermsResponse = {
  type: 4,
  data: {
    content: "Please read over the disclaimers regarding [Automating Submissions](https://wiki.sponsor.ajay.app/w/Automating_Submissions). Your publicID will be allowlisted",
    flags: 64,
    components: [{
      type: 1,
      components: [{
        type: 2,
        label: "Continue",
        style: 3,
        custom_id: "automod_deny"
      }, {
        type: 2,
        label: "I have read over the disclaimers",
        style: 4,
        custom_id: "automod_accept"
      }]
    }]
  }
};

module.exports = {
  name: "automod",
  description: "Get segment suggestion from SponsorBlock ML",
  options: autoModOptions,
  execute: async ({ interaction, response }) => {
    const rootOptions = interaction.data.options[0];
    const findNestedOption = (name) => (rootOptions?.options.find((opt) => opt.name === name))?.value;
    const cmdName = rootOptions.name;
    const dID = interaction?.member?.user.id ?? interaction.user.id;
    // allowList check
    if (cmdName === "get" || cmdName === "share") {
      const allowList = await USERS.get("ml_allow", { type: "json" });
      if (!allowList.allow.includes(dID))
        return response(contentResponse("You are not allowlisted for automod - run /automod acceptterms", true));
    }
    // run commands
    if (cmdName === "acceptterms") {
      return response(acceptTermsResponse);
    } else if (cmdName === "get") {
      const video_id = findNestedOption("videoid");
      const category = findNestedOption("category");
      const batch = findNestedOption("batch");
      const message = await sendAutoMod({edit: false, video_id, category, batch});
      return response(message);
    } else if (cmdName === "share") {
      const video_id = findNestedOption("videoid");
      const message = await sendAutoMod({edit: false, video_id });
      delete message.data?.components;
      message.data.flags = 0;
      return response(message);
    } else if (cmdName === "info") {
      const data = await ml("info").then((res) => res.json());
      const embed = await formatAutomodInfo(data);
      return response(embedResponse(embed, false));
    }
  }
};
