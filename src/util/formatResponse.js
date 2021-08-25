const sbcutil = require("./sbc-util");
const { getSegmentInfo } = require("./min-api.js");
const { parseUserAgent } = require("./parseUserAgent.js");
const { secondsToTime } = require("./timeConvert.js");

const userNameFilter = (userName) => 
  // only take 64 chars, nullify url
  userName.trim().substring(0,64).replace(/https:\/\//g, "https//");

const userName = (result) => result.vip ? `[VIP] ${userNameFilter(result.userName)}` : userNameFilter(result.userName);

const durationFormat = (duration) => {
  // split ms
  const ms = (duration+"").split(".")[1];
  // convert seconds
  const hms = new Date(duration * 1000).toISOString().substr(11,8);
  return `${hms}${ms ? "."+ms : ""}`;
};

const formatDate = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);
  return dateObj.toISOString().replace(/T/, " ").replace(/\..+/, "");
};

const formatVote = (result) => {
  let votes = result.votes;
  if (result.votes <= -2) votes += " ❌"; // hidden
  if (result.locked) votes += " 👑"; // locked
  return votes;
};

const hidden = (result) => {
  if (result.hidden) return "❌ Hidden"; // if hidden
  if (result.shadowHidden) return "❌ Shadowhidden"; // if shadowHidden
  if (result.votes <= -2) return "❌ Downvoted"; // if votes <=2
  return "Not Hidden";
};

const formatUser = (result, submitted) => 
  `${userName(result)}
  **Submitted:** ${result.segmentCount.toLocaleString("en-US")}
  **Reputation:** ${result.reputation.toFixed(2)}
  **Segment Views:** ${result.viewCount.toLocaleString("en-US")}
  **Time Saved:** ${sbcutil.minutesReadable(result.minutesSaved)}
  **Current Warnings:** ${result.warnings}
  **Ignored Submissions:** ${result.ignoredSegmentCount}
  **Ignored Views:** ${result.ignoredViewCount}
  **Last Submission:** \`${result.lastSegmentID}\`
  **Last Submittion Time:** ${formatDate(submitted)}
  `;

const formatSegment = (result) =>
  `**Submitted:** ${formatDate(result.timeSubmitted)}
  **Video ID:** ${result.videoID}
  **Start:** ${durationFormat(result.startTime)}
  **End:** ${durationFormat(result.endTime)}
  **Length:** ${durationFormat((result.endTime - result.startTime).toFixed(2))}
  **Votes:** ${formatVote(result)}
  **Views:** ${result.views.toLocaleString("en-US")}
  **Category:** ${result.category}
  **Video Duration:** ${result.videoDuration}
  **Hidden:** ${hidden(result)}
  **User Agent:** ${parseUserAgent(result.userAgent)}
  **User ID:** \`${result.userID}\`
  `;

const formatShowoff = (result) => 
  `${userName(result)}
 **Submissions:** ${result.segmentCount.toLocaleString("en-US")}
  You've saved people from **${result.viewCount.toLocaleString("en-US")}** segments
  (**${sbcutil.minutesReadable(result.minutesSaved)}** of their lives)
  `;

const formatUserID = (result) => {
  let str = "";
  for (const user of result) {
    str += `${user.userName}: \`${user.userID}\`\n`;
  }
  return str;
};

/**
 * Get time of last segment
 * @param {Object} lastSegmentID 
 * @returns 
 */
async function getLastSegmentTime(lastSegmentID) {
  if (!lastSegmentID) return null;
  const segmentParse = await getSegmentInfo(lastSegmentID);
  return segmentParse ? segmentParse[0].timeSubmitted : null;
}

const allCategories = ["interaction", "intro", "music_offtopic", "outro", "preview", "selfpromo", "sponsor"];

const deepEquals = (a,b) => {
  let result = true;
  b.forEach((e) => { 
    if (!a.includes(e)) result = false;
  });
  return result;
};

const formatLockCategories = (result) => {
  if (result === "Not Found") return result;
  const parsed = JSON.parse(result);
  let { categories, reason } = parsed;
  categories = (deepEquals(categories, allCategories)) ? "> **All**" : `>>> ${categories.join("\n")}`;
  return `Locked Categories:\n ${categories}\
  \n Reason: \`${reason}\``;
};

const segmentsNotFoundEmbed = (videoID) => {
  return {
    title: videoID,
    description: "No Segments Found",
    url: `https://sb.ltn.fi/video/${videoID}`,
    color: 0xff0000
  };
};

const formatSkipSegments = (videoID, result) => {
  if (result === "Not Found") return segmentsNotFoundEmbed(videoID);
  const body = JSON.parse(result);
  let embed = {
    title: videoID,
    url: `https://sb.ltn.fi/video/${videoID}`,
    color: 0xff0000,
    fields: []
  };
  for (const segment of body) {
    embed.fields.push({
      name: segment.UUID,
      value: `${segment.category} | ${secondsToTime(segment.segment[0])} - ${secondsToTime(segment.segment[1])}`
    });
  }
  return embed;
};

module.exports = {
  formatShowoff,
  formatSegment,
  formatUser,
  formatUserID,
  getLastSegmentTime,
  formatLockCategories,
  formatSkipSegments
};
