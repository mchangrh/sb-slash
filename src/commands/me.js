const format = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, noStoredID, timeoutResponse } = require("../util/invalidResponse.js");
const api = require("../util/min-api.js");
const { userStrictCheck } = require("../util/validation.js");
const { hideOption, publicIDOption, pieChartOption } = require("../util/commandOptions.js");
const [SUBCOMMAND, GROUP] = [1, 2];

// get existing SBID with cache of 24hr
const getSBID = (dID) => NAMESPACE.get(dID, {cacheTtl: 86400});

const findNestedOption = (rootOptions, name) => ((objCheck(rootOptions) && (rootOptions.options.find((opt) => opt.name === name))) || false);
const objCheck = (rootOptions) => (rootOptions && ("options" in rootOptions));

const contentResponse = (content, hide) => {
  return {
    type: 4,
    data: {
      content,
      flags: (hide ? 64 : 0)
    }
  };
};

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
      options: [publicIDOption]
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
    // set up constants
    const dUser = (interaction.member) ? interaction.member.user : interaction.user;
    const dID = dUser.id;
    const dUserName = `${dUser.username}#${dUser.discriminator}`;
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const hide = findNestedOption(rootOptions, "hide");
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
      return response(contentResponse(`Associated \`${SBID}\` with **\`${dUserName}\`**`, false));
    } else {
      let embed;
      const SBID = await getSBID(dID); // get SBID
      if (SBID === null) return response(noStoredID); // if no stored, return error
      // userid get
      if (cmdName === "userid") { // userid get
        return response(contentResponse(`**\`${dUserName}\`** has associated with \`${SBID}\``, false));
      } else if (cmdName === "userinfo") { // userinfo
        const res = await Promise.race([api.getUserInfo(SBID), api.timeout]);
        if (!res) return response(timeoutResponse);
        const timeSubmitted = await format.getLastSegmentTime(res.lastSegmentID);
        return response({
          type: 4,
          data: {
            content: format.formatUser(res, timeSubmitted),
            components: userComponents(SBID, false),
            flags: (hide ? 64 : 0)
          }
        });
      } else if (cmdName === "showoff") { // showoff
        const res = await Promise.race([api.getUserInfoShowoff(SBID), api.timeout]);
        if (!res) return response(timeoutResponse);
        embed = format.formatShowoff(SBID,res);
      } else if (cmdName === "userstats") { // userstats
        const sort = findNestedOption(rootOptions, "sort");
        const res = await Promise.race([api.getUserStats(SBID), api.timeout]);
        if (!res) return response(timeoutResponse);
        embed = format.formatUserStats(SBID, res, sort, piechart);
      }
      return response({ // misc response
        type: 4,
        data: {
          embeds: [embed],
          flags: (hide ? 64 : 0)
        }
      });
    }
  }
};

