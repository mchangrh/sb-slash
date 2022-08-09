const { automodComponents } = require("./components.js");
const { EMOJI_MAP } = require("sb-category-type");
const { ml } = require("./automod_api.js");
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
    return await sendAutoMod(options);
  } catch(err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return errorResponse(true, "Syntax Error");
  }
};

const sendAutoMod = async (options={}) => {
  const edit = options?.edit ?? true;
  delete options.edit;
  const videoChoice = await ml("get", options);
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
  // construct embed
  const videoID = videoChoice.video_id;
  const url = `https://www.youtube.com/watch?v=${videoID}`;
  const submitAllArr = [];
  // setup embed
  let embed = {
    title: videoID,
    description: `batch \`${videoChoice.batch}\``,
    color: 0xff0000,
    url,
    fields: [],
    footer: {
      text: ""
    }
  };
  if (options) embed.footer.text = JSON.stringify(options);
  for (const result of videoChoice?.missed ?? []) {
    const prob = sortProbabilites(result.probabilities);
    submitAllArr.push({segment: [result.start, result.end], category: result.category.toLowerCase()});
    embed.fields.push(formatAutoModField(result, videoID, prob));
  }
  return {
    type: edit ? 7 : 4,
    data: {
      embeds: [embed],
      components: automodComponents(videoID, submitAllArr),
      flags: 64
    }
  };
};

const intPercent = (int) => `${(int*100).toFixed(1)}%`;
const sortProbabilites = (prob) =>
  Object.entries(prob)
    .sort((a,b) => b[1]-a[1]);

const formatAutoModField = (aiResult, videoID, prob) => {
  const probEmoji = prob.map((e) =>
    [EMOJI_MAP[e[0].toLowerCase()] + ": " + intPercent(e[1])]
  ).flat().join(" | ");
  const topCategoryName = aiResult.category.toLowerCase();
  const slicedText = aiResult.text.length >= 500 ? aiResult.text.slice(0, 500) + "..." : aiResult.text;
  const submitLink = `https://www.youtube.com/watch?v=${videoID}&t=${aiResult.start-2}s#segments=[{"segment":[${aiResult.start}, ${aiResult.end}],"category":"${topCategoryName}","actionType":"skip"}]`;
  const topCategory = `${EMOJI_MAP[topCategoryName]}: ${intPercent(aiResult.probability)}`;
  return {
    name: `${secondsToTime(aiResult.start)}-${secondsToTime(aiResult.end)} | Missed ${topCategory}`,
    value: `${probEmoji}
    ${tripleTick+slicedText+tripleTick}[submit](${encodeURI(submitLink)})`
  };
};

module.exports = {
  getNextFromEmbed,
  sendAutoMod
};
