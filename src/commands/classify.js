const { formatClassifyInfo } = require("../util/formatResponse.js");
const { segmentIDOption, segmentIDRequired } = require("../util/commandOptions.js");
const { classify } = require("../util/automod_api.js");
const { embedResponse } = require("../util/discordResponse.js");
const { sendClassify } = require("../util/classify.js");
const categoryChoices = [{
  name: "Sponsor", value: "sponsor"
}, {
  name: "Unpaid/ Self Promotion", value: "selfpromo"
}, {
  name: "Interaction Reminder", value: "interaction"
}];

const options = [{
  name: "get",
  description: "Get caregory suggestion",
  type: 1,
  options: [segmentIDOption, {
    name: "batch",
    description: "Specify batch",
    type: 3,
    required: false
  }, {
    name: "from",
    description: "Category to get suggestions for",
    type: 3,
    required: false,
    choices: categoryChoices
  }, {
    name: "to",
    description: "Category to get suggestions for",
    type: 3,
    required: false,
    choices: [
      ...categoryChoices,
      { name: "None", value: "none"}
    ]
  }, {
    name: "search",
    description: "Text to search for",
    type: 3,
    required: false
  }, {
    name: "flagged",
    description: "Only get flagged suggestions",
    type: 5,
    required: false
  }]
}, {
  name: "share",
  description: "Share category suggestion",
  type: 1,
  options: [segmentIDRequired]
}, {
  name: "info",
  description: "Get database stats",
  type: 1
}];

module.exports = {
  name: "classify",
  description: "Get category suggestion from SponsorBlock ML",
  options,
  execute: async ({ interaction, response }) => {
    const rootOptions = interaction.data.options[0];
    const findNestedOption = (name) => (rootOptions?.options.find((opt) => opt.name === name))?.value;
    const cmdName = rootOptions.name;
    const dID = interaction?.member?.user.id ?? interaction.user.id;
    // allowlist Check
    if (cmdName === "get" || cmdName === "share") {
      const allowList = await USERS.get("ml_allow", { type: "json" });
      if (!allowList.allow.includes(dID))
        return response(contentResponse("You are not allowlisted for automod - run /automod acceptterms", true));
    }
    // run commands
    if (cmdName === "get") {
      const uuid = findNestedOption("segmentid");
      const batch = findNestedOption("batch");
      const from = findNestedOption("from");
      const to = findNestedOption("to");
      const search = findNestedOption("search");
      const flagged = findNestedOption("flagged");
      const message = await sendClassify({edit: false, uuid, batch, from, to, search, flagged});
      return response(message);
    } else if (cmdName === "share") {
      const uuid = findNestedOption("segmentid");
      const message = await sendClassify({edit: false, uuid });
      delete message.data?.components;
      message.data.flags = 0;
      return response(message);
    } else if (cmdName === "info") {
      const data = await classify("info").then((res) => res.json());
      const embed = await formatClassifyInfo(data);
      return response(embedResponse(embed, false));
    }
  }
};
