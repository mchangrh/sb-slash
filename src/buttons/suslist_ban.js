const { notVIP } = require("../util/invalidResponse.js");
const { contentResponse } = require("../util/discordResponse.js");
const { checkVIP } = require("../util/cfkv.js");
const { logEmbed } = require("../util/log.js");
const { vip } = require("../util/min-api.js");

module.exports = {
  name: "suslist_ban",
  execute: async ({ interaction, response }) => {
    // user equivalence checks
    const currentDID = interaction.user ? interaction.user.id : interaction.member.user.id;
    const previousInteraction = interaction.message.interaction;
    const previousDID = previousInteraction.user ? previousInteraction.user.id : previousInteraction.member.user.id;
    if (currentDID !== previousDID) return response(contentResponse("Discord ID mismatch"));
    // vip checks
    const dUser = interaction?.member;
    const isVIP = await checkVIP(dUser);
    if (!isVIP) return response(notVIP);
    // check for 🛑
    const embed = interaction.message.embeds[0];
    const hasRed = embed?.title?.includes("🛑");
    if (!hasRed) return response(contentResponse("Threshold not met"));
    const userID = embed?.footer?.text?.trim();
    // proceed with ban, repost message
    await logEmbed(dUser.user, embed);
    await vip.susBan(userID);
    return response(contentResponse("Banned"));
  }
};
