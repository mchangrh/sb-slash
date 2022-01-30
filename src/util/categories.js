const CATEGORIES_ARR = ["sponsor", "intro", "outro", "interaction", "selfpromo", "music_offtopic", "preview", "poi_highlight", "filler"];
const CATEGORY_COLORS_ARR = ["#00d400", "#00ffff", "#0202ed", "#cc00ff", "#ffff00", "#ff9900", "#008fd6", "#ff1684", "#6600ff"];
const CATEGORIES_STRING = `categories=["${CATEGORIES_ARR.join("\",\"")}"]`;

module.exports = {
  CATEGORIES_ARR,
  CATEGORY_COLORS_ARR,
  CATEGORIES_STRING
};