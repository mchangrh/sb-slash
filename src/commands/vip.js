const { axiosResponse } = require("../util/formatResponse.js");
const { notVIP } = require("../util/invalidResponse.js");
const { vip } = require("../util/min-api.js");
const { videoIDOption, uuidOption, categoryOption } = require("../util/commandOptions.js");
const { checkVIP } = require("../util/cfkv.js");
const { log } = require("../util/log.js");

module.exports = {
  name: "vip",
  description: "VIP-only commands",
  options: [{
    name: "category",
    description: "Change category",
    type: 1,
    options: [ uuidOption, categoryOption ]
  }, {
    name: "cache",
    description: "Clear redis cache",
    type: 1,
    options: [ videoIDOption ]
  }, {
    name: "purge",
    description: "Purge all segments on a video",
    type: 1,
    options: [ videoIDOption ]
  }, {
    name: "downvote",
    description: "Downvote a segment",
    type: 1,
    options: [ uuidOption ]
  }, {
    name: "undovote",
    description: "Undo a downvote on a segment",
    type: 1,
    options: [ uuidOption ]
  }],
  execute: async ({ interaction, response }) => {
    // check that user is VIP
    const dUser = interaction.member;
    if (!dUser || !checkVIP(dUser.roles)) return response(notVIP);
    // setup
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const objCheck = () => (rootOptions && ("options" in rootOptions));
    const nested = (name) => (objCheck(rootOptions) && (rootOptions.options.find((opt) => opt.name === name).value));

    let result;
    // command switch
    if (cmdName === "category") {
      const uuid = nested("uuid");
      const category = nested("category");
      result = await vip.postChangeCategory(uuid, category);
    } else if (cmdName === "cache") {
      const videoID = nested("videoid");
      result = await vip.postClearCache(videoID);
    } else if (cmdName === "purge") {
      const videoID = nested("videoid");
      result = await vip.postPurgeSegments(videoID);
    } else if (cmdName === "downvote") {
      const uuid = nested("uuid");
      await log(dUser.user, cmdName, uuid);
      result = await vip.postVoteOnSegment(uuid, 0);
    } else if (cmdName === "undovote") {
      const uuid = nested("uuid");
      await log(dUser.user, cmdName, uuid);
      result = await vip.postVoteOnSegment(uuid, 20);
    }

    // response
    const resResponse = await axiosResponse(result);
    return response({
      type: 4,
      data: { content: `${cmdName} ${resResponse}`}
    });
  }
};
