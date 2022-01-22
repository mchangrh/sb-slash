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
const uuidOption = {
  name: "uuid",
  description: "UUID of the segment",
  type: ApplicationCommandOptionType.STRING,
  required: true
};
const categoryOption = {
  name: "category",
  description: "Category to change to",
  type: ApplicationCommandOptionType.STRING,
  required: true,
  choices: [{
    name: "Sponsor", value: "sponsor"
  }, {
    name: "Unpaid/ Self Promotion", value: "selfpromo"
  }, {
    name: "Interaction Reminder", value: "interaction"
  }, {
    name: "Intermission/ Intro Animation", value: "intro"
  }, {
    name: "Endcards/ Outro", value: "outro"
  }, {
    name: "Preview/ Recap", value: "preview"
  }, {
    name: "Music: Non-Music", value: "music_offtopic"
  }, {
    name: "Filler", value: "filler"
  }]
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
  uuidOption,
  categoryOption,
  findOption,
  findOptionString
};