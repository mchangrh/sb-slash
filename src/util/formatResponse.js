const columnify = require("columnify");
const { getSegmentInfo } = require("./min-api.js");
const { parseUserAgent } = require("./parseUserAgent.js");
const { CATEGORIES_ARR } = require("./categories.js");

// https://github.com/MRuy/sponsorBlockControl/blob/61f0585c9bff9c46f6fde06bb613aadeffb7e189/src/utils.js
const minutesReadable = (minutes) => {
  const years = Math.floor(minutes / 60 / 24 / 365);
  const days = Math.floor(minutes / 60 / 24) % 365;
  const hours = Math.floor(minutes / 60) % 24;
  let str = "";
  str += `${years > 0 ? years + "y" : ""}`;
  str += `${days > 0 ? days + "d" : ""}`;
  str += `${hours > 0 ? hours + "h" : ""}`;
  if (years == 0) str += `${(minutes % 60).toFixed(1)}m`;
  return str.trim();
};

const secondsToTime = (e) => {
  const h = Math.floor(e / 3600).toString().padStart(1,"0"),
    m = Math.floor(e % 3600 / 60).toString().padStart(2,"0"),
    s = Math.floor(e % 60).toString().padStart(2,"0"),
    msRaw = (e + "").split(".")[1], // split ms
    ms = msRaw ? `.${msRaw}` : "";

  return `${h}:${m}:${s}${ms}`;
};

const videoTimeLink = (videoID, startTime, UUID = "") => `https://www.youtube.com/watch?v=${videoID}&t=${startTime.toFixed(0)-2}s${videoSegmentLink(UUID)}`;

const videoSegmentLink = (UUID) => UUID.length ? (`#requiredSegment=${UUID}`) : "";

const emptyEmbed = () => {
  return {
    color: 0xff0000,
    fields: []
  };
};

const emptyVideoEmbed = (videoID) => {
  return {
    ...emptyEmbed(),
    title: videoID,
    url: `https://sb.ltn.fi/video/${videoID}/`
  };
};

const userNameFilter = (userName) =>
  // only take 64 chars, nullify url
  userName.trim().substring(0,64).replace(/https:\/\//g, "https//");

const userName = (result) => result.vip ? `[VIP] ${userNameFilter(result.userName)}` : userNameFilter(result.userName);

const visibility = (result) =>
  (result.hidden) ? "❌ Hidden"
    : (result.shadowHidden) ? "🚫 Shadowhidden"
      : (result.votes <= -2) ? "👎 Downvoted"
        :"Visible";

const formatVote = (result) =>
  (result.hidden) ? "❌"
    : (result.shadowHidden) ? "🚫"
      : (result.votes === -2) ? "👎"
        : (result.locked) ? `🔒 ${result.votes}`
          : `✅ ${result.votes}`;

const totalPages = (total) => {
  const [quo, rem] = [total/10, total%10];
  return rem === 0 ? quo-1 : Math.floor(quo);
};

const actionType = (type) => (type == "mute") ? "🔇" : "⏭️";

const segmentTimes = (start, end) =>
  (start == end)
    ? `${secondsToTime(start)}`
    : `${secondsToTime(start)} - ${secondsToTime(end)}`;

const categoryColour = {
  "sponsor": 54272,
  "selfpromo": 16776960,
  "interaction": 13369599,
  "intro": 65535,
  "outro": 131821,
  "preview": 36822,
  "music_offtopic": 16750848,
  "poi_highlight": 16717444,
  "default": 16711680
};

const timeStamp = (time) => `<t:${(""+time).substring(0,10)}:R>`;

const formatUser = (result, submitted) =>
  `${userName(result)}
  **Submitted:** ${result.segmentCount.toLocaleString("en-US")}
  **Reputation:** ${result.reputation.toFixed(2)}
  **Segment Views:** ${result.viewCount.toLocaleString("en-US")}
  **Time Saved:** ${minutesReadable(result.minutesSaved)}
  **Current Warnings:** ${result.warnings}
  **Ignored Submissions:** ${result.ignoredSegmentCount}
  **Ignored Views:** ${result.ignoredViewCount}
  **Last Submission:** \`${result.lastSegmentID}\`
  **Last Submission Time:** ${timeStamp(submitted)}
  `;

const formatSegment = (result) => {
  const embed = emptyEmbed();
  const { videoID, category, startTime, endTime, UUID } = result;
  const videoLink = videoTimeLink(videoID, startTime, UUID);
  embed.title = videoID;
  embed.url = `https://sb.ltn.fi/video/${videoID}/`;
  embed.color = categoryColour[category] || categoryColour["default"];
  embed.description = `[${category}](${videoLink}) | ${actionType(result.actionType)} | **Submitted:** ${timeStamp(result.timeSubmitted)}
  ${segmentTimes(startTime, endTime)} **Length:** ${secondsToTime((endTime - startTime).toFixed(2))}
  **Votes:** ${formatVote(result)} | **Views:** ${result.views.toLocaleString("en-US")} | **Visibility:** ${visibility(result)}
  **User Agent:** ${parseUserAgent(result.userAgent)}
  **Video Duration:** ${secondsToTime(result.videoDuration)}
  **User ID:** \`${result.userID}\`
  `;
  return embed;
};

const formatShowoff = (publicID, result) => {
  const embed = emptyEmbed();
  embed.title = userName(result);
  embed.url = `https://sb.ltn.fi/userid/${publicID}/`;
  embed.description = `**Submissions:** ${result.segmentCount.toLocaleString("en-US")}
  You've saved people from **${result.viewCount.toLocaleString("en-US")}** segments
  (**${minutesReadable(result.minutesSaved)}** of their lives)`;
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
    const [ startTime, endTime ] = segment.segment;
    const name = segment.UUID;
    embed.fields.push({
      name,
      value: `[${segment.category}](${videoTimeLink(videoID, startTime, name)}) | ${actionType(segment.actionType)} | ${segmentTimes(startTime, endTime)}`
    });
  }
  return embed;
};

const formatSearchSegments = (videoID, result) => {
  if (result === "Not Found") return segmentsNotFoundEmbed(videoID);
  const embed = emptyVideoEmbed(videoID);
  const parsed = JSON.parse(result);
  embed.description = `**Segments:** ${parsed.segmentCount} | **Page:**: ${parsed.page}/${totalPages(parsed.segmentCount)}`;
  const segments = parsed.segments;
  for (const segment of segments) {
    const { startTime, endTime } = segment;
    const name = segment.UUID;
    embed.fields.push({
      name,
      value: `[${segment.category}](${videoTimeLink(videoID, startTime, name)}) | ${formatVote(segment)} | ${`👀 ${segment.views}`} | ${actionType(segment.actionType)} | ${segmentTimes(startTime, endTime)}`
    });
  }
  return embed;
};

const formatStatus = async (res) => {
  const embed = emptyEmbed();
  embed.title = "SponsorBlock Server Status";
  embed.url = "https://status.sponsor.ajay.app/";
  if (!res.ok) {
    embed.description = `Server Unavailable: ${res.status} ${res.statusText}`;
  } else {
    const data = await res.json();
    embed.fields.push(
      {
        name: "Uptime",
        value: secondsToTime(data.uptime),
        inline: true
      }, {
        name: "Commit",
        value: `[${data.commit.substring(0,7)}](https://github.com/ajayyy/SponsorBlockServer/commit/${data.commit})`,
        inline: true
      }, {
        name: "DB Version",
        value: data.db,
        inline: true
      }, {
        name: "Process Time",
        value: `${data.processTime} ms`,
        inline: true
      }, {
        name: "5 Minute Load",
        value: `${data.loadavg[0].toFixed(2)}/2`,
        inline: true
      }, {
        name: "15 Minute Load",
        value: `${data.loadavg[1].toFixed(2)}/2`,
        inline: true
      }
    );
  }
  return embed;
};

const formatUserStats = (publicID, data, sort) => {
  // format response
  const total = data.overallStats.segmentCount;
  const timeSaved = minutesReadable(data.overallStats.minutesSaved);
  const percentage = (value) => total ? ((value/total)*100).toFixed(2)+"%" : "0%";
  const columnifyConfig = {
    columnSplitter: " | ",
    showHeaders: false
  };
  const typeConfig = {
    ...columnifyConfig,
    config: {
      key: { minWidth: 14 }
    }
  };
  let categoryData = [];
  const typeData = [];
  for (const [key, value] of Object.entries(data.categoryCount)) {
    categoryData.push({key, value, a:percentage(value)});
  }
  for (const [key, value] of Object.entries(data.actionTypeCount)) {
    typeData.push({key, value, a:percentage(value)});
  }
  // sort categorydata
  if (sort) categoryData = categoryData.sort((a,b) => b.value-a.value);
  // send result
  const embed = emptyEmbed();
  embed.title = data.userName;
  embed.url = `https://sb.ltn.fi/userid/${publicID}/`;
  embed.description = `**Total Segments:** ${total}\n **Time Saved:** ${timeSaved}`;
  embed.fields.push(
    {
      name: "Category Breakdown",
      value: "```"+columnify(categoryData, columnifyConfig)+"```"
    }, {
      name: "Type Breakdown",
      value: "```"+columnify(typeData, typeConfig)+"```"
    }
  );
  return embed;
};

module.exports = {
  formatShowoff,
  formatSegment,
  formatUser,
  formatUserID,
  getLastSegmentTime,
  formatLockCategories,
  formatSkipSegments,
  formatSearchSegments,
  formatStatus,
  formatUserStats
};
