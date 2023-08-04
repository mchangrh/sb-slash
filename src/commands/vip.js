const { axiosResponse, formatSus } = require("../util/formatResponse.js");
const { notVIP, invalidVideoID, noStoredID, invalidPublicID, noOptions } = require("../util/invalidResponse.js");
const { vip } = require("../util/min-api.js");
const { videoIDRequired, uuidOption, userOptionRequired, categoryOption, publicIDOptionRequired, publicIDOptionOptional,userOptionOptional, hideOption } = require("../util/commandOptions.js");
const { userLinkCheck, userLinkExtract, findVideoID, userStrictCheck } = require("../util/validation.js");
const { checkVIP, getSBID, lookupSBID, postSBID } = require("../util/cfkv.js");
const { actionRow, lockResponse, categoryComponent } = require("../util/lockCommon.js");
const { log } = require("../util/log.js");
const { contentResponse, componentResponse } = require("../util/discordResponse.js");
const { isSus } = require("../util/sus-api.js");
const { bannedComponents, susListComponents } = require("../util/suslist.js");

const pingOption = {
  name: "ping",
  description: "Ping user",
  type: 5,
  required: false
};

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
    options: [{
      name: "feature",
      description: "feature to grant",
      type: 3,
      required: true,
      choices: [
        { name: "Chapter", value: "0" },
        { name: "Filler", value: "1" },
        { name: "DeArrow Titles", value: "2" }
      ]
    }, publicIDOptionOptional, userOptionOptional ]
  }, {
    name: "lookup",
    description: "Look up Discord ID from SBID",
    type: 1,
    options: [ publicIDOptionRequired, pingOption ]
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
  }, {
    name: "suslist",
    description: "Check user against private sus list",
    type: 1,
    options: [ publicIDOptionRequired, hideOption ]
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
      const publicid = nested("publicid") || "";
      const user = nested("user");
      const feature = nested("feature");
      // if only feature
      if (!publicid && !user) return response(noOptions);
      // invalid publicID & no user
      if (!userStrictCheck(publicid) && !userLinkCheck(publicid) && !user) return response(invalidPublicID);
      // no publicID, we are only searching by SBID
      const SBID = await getSBID(user);
      if (user && !publicid) {
        if (!SBID) return response(noStoredID);
      }
      // lookup
      const userID = (user && !publicid) ? SBID
        : userStrictCheck(publicid) ? publicid
          : userLinkExtract(publicid);
      await vipLog(`${userID} given feature ${feature}`);
      result = await vip.addFeature(userID, feature)
        .catch((err) => apiErr(err));
    } else if (cmdName === "lookup") {
      const SBID = nested("publicid");
      const dID = await lookupSBID(SBID);
      const ping = nested("ping");
      const mentions = ping ? { users: [dID] } : { parse: [] };
      return response({
        type: 4,
        data: {
          content: dID ? `<@${dID}>` : "Not found",
          allowed_mentions: mentions,
          flags: ping ? 0 : 64
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
      result = await vip.getBanStatus(publicid)
        .catch((err) => apiErr(err));
      return response(contentResponse(result.banned ? "🔨 Banned" : "Not Banned"));
    } else if (cmdName === "adduser") {
      const user = nested("user");
      const publicid = nested("publicid");
      result = await postSBID(user, publicid)
        .catch((err) => apiErr(err));
      return response(contentResponse(await result.text(), true));
    } else if (cmdName === "suslist") {
      const publicid = nested("publicid");
      const hide = nested("hide") ?? true;
      result = await isSus(publicid)
        .catch((err) => apiErr(err));
      const data = await result.json();
      const isBanned = await vip.getBanStatus(publicid);
      const components = isBanned.banned ? bannedComponents :  susListComponents;
      return response(componentResponse(formatSus(data, publicid), components, hide));
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
