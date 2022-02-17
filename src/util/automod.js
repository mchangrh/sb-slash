const { automodComponents } = require("./components.js");
const { EMOJI_MAP } = require("sb-category-type");
const { secondsToTime } = require("./formatResponse.js");

// add to emoji map
EMOJI_MAP["null"] = "❌";
const tripleTick = "```";

exports.sendAutoMod = async(edit = true, videoID = null) => {
  const videoChoice = videoID ? await XENOVA_ML.get(`missed:${videoID}`, { type: "json"}) : await chooseSuggestion();
  if (!videoChoice) {
    return {
      type: edit ? 7 : 4,
      data: {
        content: "No suggested segments available",
        flags: 64
      }
    };
  }
  return formatVideoChoice(videoChoice, edit);
};

const formatVideoChoice = (videoChoice, edit) => {
  // construct embed
  const videoID = videoChoice.video_id;
  const url = `https://www.youtube.com/watch?v=${videoID}`;
  const submitAllArr = [];
  // setup embed
  let embed = {
    title: videoID,
    color: 0xff0000,
    url,
    fields: []
  };
  for (const result of videoChoice?.missed ?? []) {
    const prob = sortProbabilites(result.probabilities);
    submitAllArr.push({segment: [result.start, result.end], category: prob[0][0]});
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

const intPercent = (int) => `${(int*100).toPrecision(2)}%`;
const sortProbabilites = (prob) =>
  Object.entries(prob)
    .sort((a,b) => b[1]-a[1]);

const chooseSuggestion = async() => {
  const videoChoice = await XENOVA_ML.list({ limit: 100, prefix: "missed:" });
  const videoChoiceList = videoChoice.keys;
  const chosenVideo = videoChoiceList[Math.floor(Math.random() * videoChoiceList.length)];
  const chosenVideObj = await XENOVA_ML.get(chosenVideo.name, { type: "json"});
  if (videoChoice.length === 0) return false;
  return chosenVideObj;
};

const formatAutoModField = (aiResult, videoID, prob) => {
  const probEmoji = prob.map((e) => [EMOJI_MAP[e[0].toLowerCase()], intPercent(e[1])] );
  const slicedText = aiResult.text.length >= 800 ? aiResult.text.slice(0, 800) + "..." : aiResult.text;
  const submitLink = `https://www.youtube.com/watch?v=${videoID}&t=${aiResult.start-2}s#segments=[{"segment":[${aiResult.start}, ${aiResult.end}],"category":"${prob[0][0]}","actionType":"skip"}]`;
  const topCategory = `${probEmoji[0][0]}: ${probEmoji[0][1]}`;
  const field = {
    name: `${secondsToTime(aiResult.start)}-${secondsToTime(aiResult.end)} | Missed ${topCategory}`,
    value: `${probEmoji.flat().join(" | ")}
    ${tripleTick+slicedText+tripleTick}
    [submit](${encodeURI(submitLink)})`
  };
  return field;
};
