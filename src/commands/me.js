const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const format = require("../util/formatResponse.js");
const { userComponents } = require("../util/components.js");
const { invalidPublicID, noStoredID } = require("../util/invalidResponse.js");
const api = require("../util/min-api.js");

const hideOption = [{
  name: "hide",
  description: "Only you can see the response",
  type: ApplicationCommandOptionType.BOOLEAN,
  required: false
}];

const strictSBIDCheck = (str) => /^[a-f0-9]{64}$/.test(str);

// get existing SBID with cache of 24hr
const getSBID = (dID) => NAMESPACE.get(dID, {cacheTtl: 86400});

const contentResponse = (content, hide) => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
      flags: (hide ? 64 : 0)
    }
  };
};

module.exports = {
  type: 1,
  name: "me",
  description: "run commands against your associated SB publicID",
  options: [{
    name: "userid",
    description: "Associate public userID",
    type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
    options: [{
      name: "set",
      description: "Set associated public userID",
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: [{
        name: "publicid",
        description: "Public User ID",
        type: ApplicationCommandOptionType.STRING,
        required: true
      }]
    }, {
      name: "get",
      description: "Get associated public userID",
      type: ApplicationCommandOptionType.SUB_COMMAND
    }]
  },
  {
    name: "userinfo",
    description: "Post userinfo",
    type: ApplicationCommandOptionType.SUB_COMMAND,
    options: hideOption
  }, {
    name: "showoff",
    description: "Post showoff",
    type: ApplicationCommandOptionType.SUB_COMMAND
  }, {
    name: "userstats",
    description: "Post userstats",
    type: ApplicationCommandOptionType.SUB_COMMAND,
    options: hideOption
  }],
  execute: async ({ interaction, response }) => {
    // set up constants
    const dUser = interaction.member.user;
    const dID = dUser.id;
    const dUserName = `${dUser.username}#${dUser.discriminator}`;
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const hide = ((rootOptions.options || [{}])[0].value || false);
    // userid set
    if (cmdName === "userid" && rootOptions.options[0].name === "set") {
      // get option and return if error
      const SBID = (rootOptions.options[0].options[0].value || "").trim();
      if (!strictSBIDCheck(SBID)) return response(invalidPublicID);
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
        const res = await api.getUserInfo(SBID);
        const timeSubmitted = await format.getLastSegmentTime(res.lastSegmentID);
        return response({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: format.formatUser(res, timeSubmitted),
            components: userComponents(SBID, false),
            flags: (hide ? 64 : 0)
          }
        });
      } else if (cmdName === "showoff") { // showoff
        const res = await api.getUserInfoShowoff(SBID);
        embed = format.formatShowoff(SBID,res);
      } else if (cmdName === "userstats") { // userstats
        const res = await api.getUserStats(SBID);
        embed = format.formatUserStats(SBID,res);
      }
      
      return response({ // misc response
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
          flags: (hide ? 64 : 0)
        }
      });
    }
  }
};
