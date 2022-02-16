const { formatAutomod } = require("./formatResponse.js");
const { automodComponents } = require("./components.js");

exports.sendAutoMod = async(edit = true) => {
  const videoChoice = await chooseSuggestion();
  if (videoChoice === false) {
    return {
      type: edit ? 7 : 4,
      data: {
        content: "No suggested segments available",
        flags: 64
      }
    };
  }
  return {
    type: edit ? 7 : 4,
    data: {
      embeds: [formatAutomod(videoChoice)],
      components: automodComponents(),
      flags: 64
    }
  };
};

const chooseSuggestion = async() => {
  const videoChoice = await XENOVA_ML.list({ limit: 100, prefix: "missed:" });
  const videoChoiceList = videoChoice.keys;
  const chosenVideo = videoChoiceList[Math.floor(Math.random() * videoChoiceList.length)];
  const chosenVideObj = await XENOVA_ML.get(chosenVideo.name, { type: "json"});
  if (videoChoice.length === 0) return false;
  return chosenVideObj;
};