const CATEGORY_NAMES = ["sponsor", "intro", "outro", "interaction", "selfpromo", "music_offtopic", "preview", "poi_highlight", "filler", "exclusive_access"];
const COLOUR_ARR = [0x00D400, 0x00FFFF, 0x0202ED, 0xCC00FF, 0xFFFF00, 0xFF9900, 0x008FD6, 0xFF1684, 0x7300FF, 0x008A5C];
const EMOJI_ARR = ["<:sponsor:936878146156892240>", "<:intro:936878146391769108>","<:outro:936878146135920700>","<:interaction_reminder:936878145993322557>","<:selfpromo:936878146228207636>","<:nonmusic:936878146186252288>", "<:preview:936878146190471178>","<:highlight:936878146316292106>","<:filler:936878145812971581>","<:exclusive_access:936878145909424179>"];
const ALL_CATEGORIES = `categories=["${CATEGORY_NAMES.join("\",\"")}"]`;

const createObj = (key, value) => {
  return key.reduce((acc, val, ind) => {
    acc[val] = value[ind];
    return acc;
  }, {});
};

const COLOUR_MAP = createObj(CATEGORY_NAMES, COLOUR_ARR);
COLOUR_MAP.default = 0xFF0000;

const EMOJI_MAP = createObj(CATEGORY_NAMES, EMOJI_ARR);

module.exports = {
  CATEGORY_NAMES,
  COLOUR_MAP,
  EMOJI_MAP,
  ALL_CATEGORIES
};