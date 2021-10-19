const { ApplicationCommandOptionType } = require("slash-commands");

const hideOption = {
  name: "hide",
  description: "Only you can see the response",
  type: ApplicationCommandOptionType.BOOLEAN,
  required: false
};
const videoIDOption = {
  name: "videoid",
  description: "Video ID",
  type: ApplicationCommandOptionType.STRING,
  required: true
};
const segmentIDOption = {
  name: "segmentid",
  description: "UUID of segment to look up",
  type: ApplicationCommandOptionType.STRING,
  required: true
};
const publicIDOption = {
  name: "publicid",
  description: "Public User ID",
  type: ApplicationCommandOptionType.STRING,
  required: true
};

module.exports = {
  hideOption,
  videoIDOption,
  segmentIDOption,
  publicIDOption
};