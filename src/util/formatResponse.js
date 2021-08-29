const sbcutil = require("./sbc-util");
const { getSegmentInfo } = require("./min-api.js");
const { parseUserAgent } = require("./parseUserAgent.js");
const { CATEGORIES_ARR } = require("./categories.js");

const secondsToTime = (e) => {
  const h = Math.floor(e / 3600).toString().padStart(1,"0"),
    m = Math.floor(e % 3600 / 60).toString().padStart(2,"0"),
    s = Math.floor(e % 60).toString().padStart(2,"0"),
    msRaw = (e + "").split(".")[1], // split ms
    ms = msRaw ? `.${msRaw}` : "";
  
  return `${h}:${m}:${s}${ms}`;
};

const videoTimeLink = (videoID, startTime) => `https://www.youtube.com/watch?v=${videoID}&t=${startTime.toFixed(0)-2}`;

const emptyEmbed = {
  color: 0xff0000,
  fields: []
};

const emptyVideoEmbed = (videoID) => {
  return {
    title: videoID,
    url: `https://sb.ltn.fi/video/${videoID}/`,
    color: 0xff0000,
    fields: []
  };
};

const userNameFilter = (userName) => 
  // only take 64 chars, nullify url
  userName.trim().substring(0,64).replace(/https:\/\//g, "https//");

const userName = (result) => result.vip ? `[VIP] ${userNameFilter(result.userName)}` : userNameFilter(result.userName);

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
  **Start:** ${secondsToTime(result.startTime)}
  **End:** ${secondsToTime(result.endTime)}
  **Length:** ${secondsToTime((result.endTime - result.startTime).toFixed(2))}
  **Votes:** ${formatVote(result)}
  **Views:** ${result.views.toLocaleString("en-US")}
  **Category:** ${result.category}
  **Video Duration:** ${secondsToTime(result.videoDuration)}
  **Action Type:** ${result.actionType}
  **Hidden:** ${hidden(result)}
  **User Agent:** ${parseUserAgent(result.userAgent)}
  **User ID:** \`${result.userID}\`
  `;

const formatShowoff = (publicID, result) => {
  const embed = {...emptyEmbed};
  embed.title = userName(result);
  embed.url = `https://sb.ltn.fi/userid/${publicID}/`;
  embed.description = `**Submissions:** ${result.segmentCount.toLocaleString("en-US")}
  You've saved people from **${result.viewCount.toLocaleString("en-US")}** segments
  (**${sbcutil.minutesReadable(result.minutesSaved)}** of their lives)`;
  return embed;
};

const formatUserID = (result) => {
  const embed = {
    color: 0xff0000,
    fields: []
  };
  for (const user of result) {
    const userIDUrl = `https://sb.ltn.fi/userid/${user.userID}/`;
    embed.fields.push({
      name: user.userName,
      value: `[\`${user.userID}\`](${userIDUrl})`,
      inline: true
    });
  }
  return embed;
};

async function getLastSegmentTime(lastSegmentID) {
  if (!lastSegmentID) return null;
  const segmentParse = await getSegmentInfo(lastSegmentID);
  return segmentParse ? segmentParse[0].timeSubmitted : null;
}

const deepEquals = (a,b) => {
  let result = true;
  b.forEach((e) => { 
    if (!a.includes(e)) result = false;
  });
  return result;
};

const formatLockCategories = (videoID, result) => {
  const embed = emptyVideoEmbed(videoID);
  if (result === "Not Found") {
    embed.fields.push({
      name: "Locked Categories",
      value: "None"
    });
    return embed;
  }
  const { categories, reason } = JSON.parse(result);
  embed.fields.push({
    name: "Locked Categories",
    value: (deepEquals(categories, CATEGORIES_ARR)) ? "All" : `${categories.join("\n")}`
  }, {
    name: "Reason",
    value: (reason ? reason : "None")
  });
  return embed;
};

const segmentsNotFoundEmbed = (videoID) => {
  return {
    title: videoID,
    description: "No Segments Found",
    url: `https://sb.ltn.fi/video/${videoID}/`,
    color: 0xff0000
  };
};

const formatSkipSegments = (videoID, result) => {
  if (result === "Not Found") return segmentsNotFoundEmbed(videoID);
  const embed = emptyVideoEmbed(videoID);
  const parsed = JSON.parse(result);
  for (const segment of parsed) {
    const videoLink = videoTimeLink(videoID, segment.segment[0]);
    const segmentTimes = (segment.segment[0] == segment.segment[1]) ?
      `${secondsToTime(segment.segment[0])}` :
      `${secondsToTime(segment.segment[0])} - ${secondsToTime(segment.segment[1])}`;
    embed.fields.push({
      name: segment.UUID,
      value: `[${segment.category}](${videoLink}) | ${segmentTimes}`
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
