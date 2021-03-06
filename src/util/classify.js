const { classifyComponents } = require("./components.js");
const { EMOJI_MAP } = require("sb-category-type");
const { classify } = require("./automod_api.js");
const { secondsToTime } = require("./formatResponse.js");

// add to emoji map
EMOJI_MAP["none"] = "❌";
const tripleTick = "```";

const errorResponse = (edit, reason) =>{
  return {
    type: edit ? 7 : 4,
    data: {
      content: "Error getting suggested segments" + reason,
      flags: 64,
      fields: [],
      components: []
    }
  };
};

const getNextFromEmbed = async (embed) => {
  try {
    const options = JSON.parse(embed?.footer?.text);
    return await sendClassify(options);
  } catch(err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return errorResponse(true, "Syntax Error");
  }
};

const sendClassify = async (options={}) => {
  const edit = options?.edit ?? true;
  delete options.edit;
  const videoChoice = await classify("get", options);
  if (videoChoice.ok) {
    const videoChoiceObj = await videoChoice.json();
    return formatVideoChoice(videoChoiceObj, edit, options);
  } else if (videoChoice.status === 404) {
    return {
      type: edit ? 7 : 4,
      data: {
        content: "No suggested segments available",
        flags: 64,
        fields: [],
        components: []
      }
    };
  } else {
    const body = await videoChoice.text();
    return errorResponse(edit, body);
  }
};

const formatVideoChoice = (videoChoice, edit, options) => {
  const title = videoChoice.uuid;
  // construct embed
  // temporary url override
  const url = `https://sb.mchang.xyz/${videoChoice.uuid}`;
  //const url = `https://www.youtube.com/watch?v=${videoChoice.video_id}`;
  // setup embed
  const embed = {
    title, url,
    color: 0xff0000,
    description: formatDescription(videoChoice),
    fields: formatClassifyFields(videoChoice),
    footer: {
      text: JSON.stringify(options)
    }
  };
  return {
    type: edit ? 7 : 4,
    data: {
      embeds: [embed],
      components: classifyComponents(videoChoice.locked),
      flags: 64
    }
  };
};

const intPercent = (int) => `${(int*100).toFixed(1)}%`;

const formatVote = (vote, locked) =>
  `Votes: ${vote} ${locked ? "🔒" : ""}`;

const formatRep = (rep) =>
  `Rep: ${rep.toFixed(2)} ${rep == 27 ? "👑" : rep > 0 ? "👍" : rep < 0 ? "👎" : "" }`;

const categories = (result) => {
  // modify result
  result.scores.NULL = result.scores.null;
  const current = result.category;
  const predicted = result.predicted;
  // null/none correction
  return `${EMOJI_MAP[current]} ${intPercent(result.scores[current.toUpperCase()])} --> ${EMOJI_MAP[predicted]} ${intPercent(result.scores[predicted.toUpperCase()])}`;
};

const formatDescription = (result) =>
  `Views: ${result.views} ${result.views >= 100 ? "🔥" : ""} | ${formatVote(result.votes, result.locked)} | ${formatRep(result.reputation)} \n${categories(result)}`;

const formatClassifyFields = (aiResult) => {
  const slicedText = aiResult.text.length >= 500 ? aiResult.text.slice(0, 500) + "..." : aiResult.text;
  const field = {
    name: secondsToTime(aiResult.start) + "-" + secondsToTime(aiResult.end),
    value: tripleTick+slicedText+tripleTick
  };
  return [field];
};

module.exports = {
  getNextFromEmbed,
  sendClassify
};
