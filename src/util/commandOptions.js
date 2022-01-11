const { ApplicationCommandOptionType } = require("slash-commands");

const findOption = (interaction, optName) => ((interaction.data.options.find((opt) => opt.name === optName) || {}).value);
const findOptionString = (interaction, optName, fallback="") => ((findOption(interaction, optName) || fallback).trim());

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
  type: ApplicationCommandOptionType.STRING
};
const publicIDOptionRequired = {
  ...publicIDOption,
  required: true
};
const publicIDOptionOptional = {
  ...publicIDOption,
  required: false
};
const userOption = {
  name: "user",
  description: "The user to get info for",
  type: ApplicationCommandOptionType.USER
};
const userOptionOptional = {
  ...userOption,
  required: false
};
const userOptionRequired = {
  ...userOption,
  required: true
};
const pieChartOption = {
  name: "piechart",
  description: "Pie chart to visualize the stats",
  type: ApplicationCommandOptionType.BOOLEAN,
  required: false
};

module.exports = {
  hideOption,
  videoIDOption,
  segmentIDOption,
  publicIDOptionRequired,
  publicIDOptionOptional,
  userOptionOptional,
  userOptionRequired,
  pieChartOption,
  findOption,
  findOptionString
};