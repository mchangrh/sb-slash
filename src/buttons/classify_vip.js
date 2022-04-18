const { getNextFromEmbed } = require("../util/classify.js");
const { classify } = require("../util/automod_api.js");
const { vip } = require("../util/min-api.js");
const { contentResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "classify_vip",
  execute: async ({ interaction, response }) => {
    const embed = interaction.message.embeds[0];
    const uuid = embed.title;
    // get user info
    const currentDID = interaction.user ? interaction.user.id : interaction.member.user.id;
    const previousInteraction = interaction.message.interaction;
    const previousDID = previousInteraction.user ? previousInteraction.user.id : previousInteraction.member.user.id;
    // validate discordID
    if (currentDID !== previousDID) {
      return contentResponse("Discord ID mismatch");
    }
    // get info from API
    const data = await classify("get", { uuid }).then((res) => res.json());
    const target = data.predicted;
    try {
      if (target === "null") {
        // if target null, downvote
        await vip.postVoteOnSegment(uuid, 0);
      } else {
        // if target not null, set category
        await vip.postChangeCategory(uuid, target);
      }
      await classify("vip", { uuid, discordID: currentDID });
    } catch(err) {
      // eslint-disable-next-line no-console
      console.log("error with voting");
      return contentResponse("Error with voting");
    }
    const message = await getNextFromEmbed(embed);
    return response(message);
  }
};
