const { secondsToTime } = require("./formatResponse.js");
const { EMOJI_MAP } = require("sb-category-type");

// emoji map
const categoryEmoji = {
  ...EMOJI_MAP,
  undefined: "⬜"
};

function merge(ranges) {
  let result = [], last;
  ranges.forEach(function (r) {
    if (!last || r[0] > last[1])
      result.push(last = r);
    else if (r[1] > last[1])
      last[1] = r[1];
  });
  return result;
}

function generateDisplay(videoID, data, spots) {
  const videoDuration = Math.max(...data.map((s) => s.videoDuration));
  const segmentTime = videoDuration / spots;

  const segmentSpots = [];
  let displayMap = [];

  // setup segment spots
  while (segmentSpots.length < spots)
    segmentSpots.push({segments: []});

  // populate segment spots
  for (const segment of data) {
    const startIndex = Math.floor(segment.segment[0] / segmentTime);
    const endIndex = Math.min(Math.floor(segment.segment[1] / segmentTime), spots - 1);
    for (let i = startIndex; i <= endIndex; i++) {
      segmentSpots[i].segments.push(segment.category);
    }
  }

  // populate category map
  for (const spot of segmentSpots) {
    // first no filler
    const segments = spot.segments.filter((s) => s !== "filler");
    // check if has filler
    const segmentHashFiller = spot.segments.includes("filler");
    const category = segments[0] ??
      (segmentHashFiller ? spot.segments[0] : undefined);
    displayMap.push(category);
  }

  // emoji map
  displayMap = displayMap.map((seg) => categoryEmoji[seg]).join("");

  const flatten = merge(data.map((d) => d.segment)).reduce((acc, cur) => acc + (cur[1] - cur[0]), 0);
  const newDuration = secondsToTime(videoDuration - flatten);
  const oldDuration = secondsToTime(videoDuration);
  return `[${videoID}](https://www.youtube.com/watch?v=${videoID}) | ${oldDuration} -> ${newDuration} \n${displayMap}`;
}

module.exports = {
  generateDisplay
};
