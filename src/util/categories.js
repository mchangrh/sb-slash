const CATEGORIES_ARR = ["sponsor", "intro", "outro", "interaction", "selfpromo", "music_offtopic", "preview", "poi_highlight", "filler"];
const CATEGORIES_STRING = `categories=["${CATEGORIES_ARR.join("\",\"")}"]`;

module.exports = {
  CATEGORIES_ARR,
  CATEGORIES_STRING
};