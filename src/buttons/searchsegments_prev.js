const { getSearchSegments, TIMEOUT } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");
const { componentResponse } = require("../util/discordResponse");
const { handleResponse } = require("../util/handleResponse");

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
  // Determine if the current user is the one who originally used the slash or message-command
  // If not, respond in a new, hidden message
  let hide = true;
  let edit = true;
  if (!(interaction.message.flags & 64)) {
    const currentDiscordUserID = interaction.user ? interaction.user.id : interaction.member.user.id;
    const previousInteraction = interaction.message.interaction;
    const previousDiscordUserID = previousInteraction.user ? previousInteraction.user.id : previousInteraction.member.user.id;
    hide = currentDiscordUserID !== previousDiscordUserID;
    edit = !hide;
  }
  // fetch
  const subreq = await Promise.race([getSearchSegments(videoID, page, paramString), scheduler.wait(TIMEOUT)]);
  const successFunc = (data) => {
    const result = componentResponse(
      formatSearchSegments(videoID, data, {...buttonOverrides, page, videoID}),
      searchSegmentsComponents(data),
      hide
    );
    result.type = edit ? 7 : 4;
    return result;
  };
  const result = await handleResponse(successFunc, subreq);
  return response(result);
};

module.exports = {
  name: "searchsegments_prev",
  execute: ({ interaction, response }) => common({ interaction, response, offset: -1 }),
  common
};
