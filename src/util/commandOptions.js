const { CATEGORY_LONGNAMES } = require("sb-category-type");

const findOption = (interaction, optName) => (interaction.data.options.find((opt) => opt.name === optName)?.value);

const categoryChoices = Object.entries(CATEGORY_LONGNAMES).map((obj) => {
  return { name: obj[0], value: obj[1] };
});

// base options
const userOption = {
  name: "user",
  description: "The user to get info for",
  type: 6
};
const videoID = {
  name: "videoid",
  description: "Video ID",
  type: 3,
  min_length: 11
};

// exported
const hideOption = {
  name: "hide",
  description: "Only you can see the response",
  type: 5,
  required: false
};

const videoIDOptional = {
  ...videoID,
  required: false
};
const videoIDRequired = {
  ...videoID,
  required: true
};
const segmentIDOption = {
  name: "segmentid",
  description: "UUID of segment to look up",
  type: 3,
  min_length: 64
};
const segmentIDRequired = {
  ...segmentIDOption,
  required: true
};
const publicIDOption = {
  name: "publicid",
  description: "Public User ID",
  type: 3,
  min_length: 64
};
const publicIDOptionRequired = {
  ...publicIDOption,
  required: true
};
const publicIDOptionOptional = {
  ...publicIDOption,
  required: false
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
  type: 5,
  required: false
};
const uuidOption = {
  name: "uuid",
  description: "UUID of the segment",
  type: 3,
  required: true
};
const categoryOption = {
  name: "category",
  description: "Category to change to",
  type: 3,
  required: true,
  choices: categoryChoices
};
const actionTypeOption = {
  name: "actiontype",
  description: "actiontype to fetch",
  type: 3,
  required: false,
  choices: [
    { name: "skip", value: "skip" },
    { name: "mute", value: "mute" }
  ]
};
const languageRequired = {
  name: "lang",
  description: "language to fetch",
  type: 3,
  required: true
};

module.exports = {
  hideOption,
  videoIDRequired,
  videoIDOptional,
  segmentIDOption,
  segmentIDRequired,
  publicIDOptionRequired,
  publicIDOptionOptional,
  userOptionOptional,
  userOptionRequired,
  pieChartOption,
  uuidOption,
  categoryOption,
  actionTypeOption,
  languageRequired,
  findOption
};
