const { getSearchSegments, TIMEOUT } = require("../util/min-api.js");
const { formatSearchSegments, segmentsNotFoundEmbed } = require("../util/formatResponse.js");
const { timeoutResponse } = require("../util/invalidResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");
const { handleResponse } = require("../util/handleResponse.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

const common = async ({ interaction, response, offset }) => {
  const buttonOverrides = JSON.parse(interaction.message.embeds[0].footer.text);
  const page = Math.max(0, buttonOverrides.page+offset);
  const { videoID } = buttonOverrides;
  delete buttonOverrides.page;
  delete buttonOverrides.videoID;
  let paramString = "";
  for (const [key, value] of Object.entries(buttonOverrides)) {
    if (value) paramString += `&${key}=${value}`;
  }
  // fetch
  const subreq = await Promise.race([getSearchSegments(videoID, page, paramString), scheduler.wait(TIMEOUT)]);
  const result = await handleResponse(subreq);
  if (result.success) {
    const responseTemplate = {
      type: 7,
      data: {
        embeds: [formatSearchSegments(videoID, body, {...buttonOverrides, page, videoID})]
      }
    };
    if (body && JSON.parse(body).segmentCount > 10) responseTemplate.data.components = searchSegmentsComponents(body);
    // Determine if the current user is the one who originally used the slash or message-command
    // If not, respond in a new, hidden message
    if (!(interaction.message.flags & 64)) {
      const currentDiscordUserID = interaction.user ? interaction.user.id : interaction.member.user.id;
      const previousInteraction = interaction.message.interaction;
      const previousDiscordUserID = previousInteraction.user ? previousInteraction.user.id : previousInteraction.member.user.id;
      if (currentDiscordUserID !== previousDiscordUserID) {
        responseTemplate.type = 4;
        responseTemplate.data.flags = 64;
      }
    }
    return response(responseTemplate);
  } else {
    // error responses
    if (result.error === "timeout") {
      return response(timeoutResponse());
    } else if (result.code === 404 ) {
      return response(embedResponse(segmentsNotFoundEmbed(videoID), hide));
    } else {
      return response(contentResponse(result.error));
    }
  }
};

module.exports = {
  name: "searchsegments_prev",
  execute: ({ interaction, response }) => common({ interaction, response, offset: -1 }),
  common
};
