const format = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, noStoredID, timeoutResponse } = require("../util/invalidResponse.js");
const api = require("../util/min-api.js");
const { userStrictCheck } = require("../util/validation.js");
const { hideOption, publicIDOptionRequired, pieChartOption } = require("../util/commandOptions.js");
const { getSBID } = require("../util/cfkv.js");
const [SUBCOMMAND, GROUP] = [1, 2];
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

const findNestedOption = (rootOptions, name) => (rootOptions?.options.find((opt) => opt.name === name))?.value;

module.exports = {
  name: "me",
  description: "run commands against your associated SB publicID",
  options: [{
    name: "userid",
    description: "Associate public userID",
    type: GROUP,
    options: [{
      name: "set",
      description: "Set associated public userID",
      type: SUBCOMMAND,
      options: [publicIDOptionRequired]
    }, {
      name: "get",
      description: "Get associated public userID",
      type: SUBCOMMAND
    }]
  },
  {
    name: "userinfo",
    description: "Post userinfo",
    type: SUBCOMMAND,
    options: [hideOption]
  }, {
    name: "showoff",
    description: "Post showoff",
    type: SUBCOMMAND
  }, {
    name: "userstats",
    description: "Post userstats",
    type: SUBCOMMAND,
    options: [
      hideOption,
      {
        name: "sort",
        description: "Sort categories in descending order",
        type: 5,
        required: false
      },
      pieChartOption
    ]
  }],
  execute: async ({ interaction, response }) => {
    const handleError = (result) => {
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        return response(embedResponse(segmentsNotFoundEmbed(videoID), hide));
      } else {
        return response(contentResponse(result.error), true);
      }
    };
    // set up constants
    const dUser = interaction?.member?.user || interaction.user;
    const dID = dUser.id;
    const dUserName = `${dUser.username}#${dUser.discriminator}`;
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const hide = findNestedOption(rootOptions, "hide") ?? false;
    const piechart = findNestedOption(rootOptions, "piechart");

    // userid set
    if (cmdName === "userid" && rootOptions.options[0].name === "set") {
      // get option and return if error
      const SBID = (rootOptions.options[0].options[0].value || "").trim();
      // delete if requested
      if (SBID == "delete") {
        await NAMESPACE.delete(dID);
        return response(contentResponse(`Removed ID from ${dUserName}`, true));
      }
      // check for valid SBID
      if (!userStrictCheck(SBID)) return response(invalidPublicID);
      // set associated publicID and return confirmation
      await NAMESPACE.put(dID, SBID);
      const oldmap = await NAMESPACE.get("vipmap", { type: "json" });
      const newmap = JSON.stringify({ ...oldmap, [SBID]: dID });
      await NAMESPACE.put("vipmap", newmap);
      return response(contentResponse(`Associated \`${SBID}\` with **\`${dUserName}\`**`, false));
    } else {
      const SBID = await getSBID(dID); // get SBID
      if (SBID === null) return response(noStoredID); // if no stored, return error
      // userid get
      if (cmdName === "userid") { // userid get
        return response(contentResponse(`**\`${dUserName}\`** has associated with \`${SBID}\``, false));
      } else if (cmdName === "userinfo") { // userinfo
        const subreq = await Promise.race([api.getUserInfo(SBID), scheduler.wait(api.TIMEOUT)]);
        const result = await api.responseHandler(subreq);
        if (result.success) { // no request errors
          const timeSubmitted = await format.getLastSegmentTime(result.data.lastSegmentID);
          return response({
            type: 4,
            data: {
              embeds: [format.formatUser(result.data, timeSubmitted)],
              components: userComponents(SBID, false),
              flags: (hide ? 64 : 0)
            }
          });
        } else handleError(result);
      } else if (cmdName === "showoff") { // showoff
        const subreq = await Promise.race([api.getUserInfoShowoff(SBID), scheduler.wait(api.TIMEOUT)]);
        const result = await api.responseHandler(subreq);
        if (result.success) { // no request errors
          return response(embedResponse(format.formatShowoff(SBID, result.data), false));
        } else handleError(result);
      } else if (cmdName === "userstats") { // userstats
        const sort = findNestedOption(rootOptions, "sort");
        const subreq = await Promise.race([api.getUserStats(SBID), scheduler.wait(api.TIMEOUT)]);
        const result = await api.responseHandler(subreq);
        if (result.success) { // no request errors
          return response(embedResponse(format.formatUserStats(SBID, result.data, sort, piechart), hide));
        } else handleError(result);
      }
    }
  }
};

