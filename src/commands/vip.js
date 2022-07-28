const { axiosResponse } = require("../util/formatResponse.js");
const { notVIP, invalidVideoID, noStoredID } = require("../util/invalidResponse.js");
const { vip } = require("../util/min-api.js");
const { videoIDRequired, uuidOption, userOptionRequired, categoryOption, publicIDOptionRequired } = require("../util/commandOptions.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { userLinkCheck, userLinkExtract } = require("../util/validation.js");
const { checkVIP, getSBID, lookupSBID, postSBID } = require("../util/cfkv.js");
const { actionRow, lockResponse, categoryComponent } = require("../util/lockCommon.js");
const { log } = require("../util/log.js");
const { findVideoID } = require("../util/validation.js");
const { contentResponse, componentResponse } = require("../util/discordResponse.js");

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
    description: "Clear redis cache for a video",
    type: 1,
    options: [ videoIDRequired ]
  }, {
    name: "purge",
    description: "Purge all segments on a video",
    type: 1,
    options: [ videoIDRequired ]
  }, {
    name: "upvote",
    description: "Upvote a segment",
    type: 1,
    options: [ uuidOption ]
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
  }, {
    name: "addvip",
    description: "Grant temporary VIP to a user",
    type: 1,
    options: [userOptionRequired, {
      name: "videoid",
      description: "Video ID from channel to grant VIP on",
      type: 3,
      required: true
    }]
  }, {
    name: "feature",
    description: "Grant features to a user",
    type: 1,
    options: [userOptionRequired, {
      name: "feature",
      description: "feature to grant",
      type: 3,
      required: true,
      choices: [
        { name: "Chapter", value: "0" },
        { name: "Filler", value: "1" }
      ]
    }]
  }, {
    name: "lookup",
    description: "Look up Discord ID from SBID",
    type: 1,
    options: [ publicIDOptionRequired ]
  }, {
    name: "unwarn",
    description: "Remove warning from a user",
    type: 1,
    options: [ publicIDOptionRequired ]
  }, {
    name: "lock",
    description: "Lock categories",
    type: 1,
    options: [ videoIDRequired, {
      name: "reason",
      description: "Custom lock reason",
      type: 3
    }]
  }, {
    name: "banstatus",
    description: "Get ban status of user",
    type: 1,
    options: [ publicIDOptionRequired]
  }, {
    name: "adduser",
    description: "Add user to /me database",
    type: 1,
    options: [ userOptionRequired, publicIDOptionRequired]
  }],
  execute: async ({ interaction, response }) => {
    // check that user is VIP
    const dUser = interaction?.member;
    const isVIP = await checkVIP(dUser);
    if (!isVIP) return response(notVIP);
    // setup
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const nested = (name) => (rootOptions?.options.find((opt) => opt?.name === name)?.value || null);

    let result;
    const vipLog = (value) => log(dUser.user, cmdName, value);

    if (cmdName === "category") {
      result = await vip.postChangeCategory(nested("uuid"), nested("category"))
        .catch((err) => apiErr(err));
    } else if (cmdName === "cache") {
      const videoID = findVideoID(nested("videoid"));
      if (!videoID) return response(invalidVideoID);
      result = await vip.postClearCache(videoID)
        .catch((err) => apiErr(err));
    } else if (cmdName === "purge") {
      const videoID = findVideoID(nested("videoid"));
      if (!videoID) return response(invalidVideoID);
      await vipLog(videoID);
      result = await vip.postPurgeSegments(videoID)
        .catch((err) => apiErr(err));
    } else if (cmdName === "upvote") {
      const uuid = nested("uuid");
      await vipLog(uuid);
      result = await vip.postVoteOnSegment(uuid, 1)
        .catch((err) => apiErr(err));
    } else if (cmdName === "downvote") {
      const uuid = nested("uuid");
      await vipLog(uuid);
      result = await vip.postVoteOnSegment(uuid, 0)
        .catch((err) => apiErr(err));
    } else if (cmdName === "undovote") {
      const uuid = nested("uuid");
      await vipLog(uuid);
      result = await vip.postVoteOnSegment(uuid, 20)
        .catch((err) => apiErr(err));
    } else if (cmdName === "addvip") {
      const user = nested("user");
      const videoID = findVideoID(nested("videoid"));
      if (!videoID) return response(invalidVideoID);
      const SBID = await getSBID(user);
      if (SBID === null) return response(noStoredID);
      await vipLog(`${SBID} on ${videoID}`);
      result = await vip.postAddTempVIP(SBID, videoID)
        .catch((err) => apiErr(err));
    } else if (cmdName === "feature") {
      const user = nested("user");
      const feature = nested("feature");
      const SBID = await getSBID(user);
      if (SBID === null) return response(noStoredID);
      await vipLog(`${SBID} given feature ${feature}`);
      result = await vip.addFeature(SBID, feature)
        .catch((err) => apiErr(err));
    } else if (cmdName === "lookup") {
      const SBID = nested("publicid");
      const dID = await lookupSBID(SBID);
      return response({
        type: 4,
        data: {
          content: dID ? `<@!${dID}>` : "Not found",
          allowed_mentions: { parse: [] },
          flags: 64
        }
      });
    } else if (cmdName === "unwarn") {
      const publicid = nested("publicid");
      if (!userLinkCheck(publicid)) return response(invalidPublicID);
      const SBID = userLinkExtract(publicid);
      await vipLog(SBID);
      result = await vip.deleteWarning(SBID)
        .catch((err) => apiErr(err));
    } else if (cmdName === "lock") {
      // videoid validation
      const videoID = findVideoID(nested("videoid"));
      if (!videoID) return response(invalidVideoID);
      const reason = nested("reason");
      // body lockOptions creation
      const lockOptions = { videoID };
      if (reason) lockOptions.reason = reason;
      const embed = lockResponse(lockOptions);
      return response(componentResponse(embed, actionRow(categoryComponent), true));
    } else if (cmdName === "banstatus") {
      const publicid = nested("publicid");
      const res = await vip.getBanStatus(publicid)
        .catch((err) => apiErr(err));
      return response(contentResponse(res.banned ? "🔨 Banned" : "Not Banned"));
    } else if (cmdName === "adduser") {
      const user = nested("user");
      const publicid = nested("publicid");
      const res = await postSBID(user, publicid)
        .catch((err) => apiErr(err));
      return response(contentResponse(res.text(), true));
    }
    // response
    const resResponse = await axiosResponse(result);
    return response(contentResponse(`${cmdName} ${resResponse}`, false));
  }
};

const apiErr = (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
  throw "api error";
};
