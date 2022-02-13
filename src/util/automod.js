const { formatAutomod } = require("./formatResponse.js");
const { automodComponents } = require("./components.js");

exports.sendAutoMod = async(edit = true) => {
  const videoChoice = await XENOVA_ML.list({ limit: 20 });
  const videoChoiceList = videoChoice.keys;
  const chosenVideo = videoChoiceList[Math.floor(Math.random() * videoChoiceList.length)];
  const chosenVideObj = await XENOVA_ML.get(chosenVideo.name, { type: "json"});
  if (videoChoiceList.length === 0) {
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
      embeds: [formatAutomod(chosenVideObj)],
      components: automodComponents(),
      flags: 64
    }
  };
};
