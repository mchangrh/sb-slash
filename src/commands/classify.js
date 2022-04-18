const { formatClassifyInfo } = require("../util/formatResponse.js");
const { segmentIDOption, segmentIDRequired } = require("../util/commandOptions.js");
const { classify } = require("../util/automod_api.js");
const { embedResponse } = require("../util/discordResponse.js");
const { sendClassify } = require("../util/classify.js");

const options = [{
  name: "get",
  description: "Get caregory suggestion",
  type: 1,
  options: [segmentIDOption]
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
      const segmentid = findNestedOption("segmentid");
      const message = await sendClassify({edit: false, segmentid});
      return response(message);
    } else if (cmdName === "share") {
      const segmentid = findNestedOption("segmentid");
      const message = await sendClassify({edit: false, segmentid });
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
