const { getSearchSegments } = require("../util/min-api.js");
const { formatSearchSegments } = require("../util/formatResponse.js");
const { searchSegmentsComponents } = require("../util/components.js");

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
  const body = await getSearchSegments(videoID, page, paramString);
  if (!body) return response(timeoutResponse);
  const responseTemplate = {
    type: 7,
    data: {
      embeds: [formatSearchSegments(videoID, body, {...buttonOverrides, page, videoID})]
    }
  };
  if (body && JSON.parse(body).segmentCount > 10) responseTemplate.data.components = searchSegmentsComponents(body);
  return response(responseTemplate);
};

module.exports = {
  name: "lookupsegment",
  execute: ({ interaction, response }) => {
    return common({ interaction, response, offset: -1 });
  },
  common
};