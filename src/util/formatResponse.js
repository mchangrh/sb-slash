const columnify = require("columnify");
const { getSegmentInfo } = require("./min-api.js");
const { parseUserAgent } = require("./parseUserAgent.js");
const { CATEGORY_NAMES, COLOUR_MAP, EMOJI_MAP } = require("./categories.js");
const tripleTick = "```";

// https://github.com/MRuy/sponsorBlockControl/blob/61f0585c9bff9c46f6fde06bb613aadeffb7e189/src/utils.js
const minutesReadable = (minutes) => {
  const years = Math.floor(minutes / 60 / 24 / 365);
  const days = Math.floor(minutes / 60 / 24) % 365;
  const hours = Math.floor(minutes / 60) % 24;
  let str = "";
  str += `${years > 0 ? years + "y " : ""}`;
  str += `${days > 0 ? days + "d " : ""}`;
  str += `${hours > 0 ? hours + "h " : ""}`;
  if (years == 0) str += `${(minutes % 60).toFixed(1)}m`;
  return str.trim();
};

const secondsToTime = (e, showMs=true) => {
  if (e == 0 && !showMs) return "None";
  const h = Math.floor(e / 3600).toString().padStart(1,"0"),
    m = Math.floor(e % 3600 / 60).toString().padStart(2,"0"),
    s = Math.floor(e % 60).toString().padStart(2,"0"),
    msRaw = (e.toFixed(2) + "").split(".")[1], // split ms
    ms = (msRaw && showMs) ? `.${msRaw}` : "";

  return `${h}:${m}:${s}${ms}`;
};

const videoTimeLink = (videoID, startTime, UUID = "") => `https://www.youtube.com/watch?v=${videoID}${startTimeLink(startTime)}${videoSegmentLink(UUID)}`;

const startTimeLink = (startTime) => (startTime >= 3) ? `&t=${startTime.toFixed(0)-2}s`: "";

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
        :"✅ Visible";

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

const actionType = (type) => { return { "mute": "🔇", "skip": "⏭️", "full": "♾️", "poi": "📌" }[type]; };

const segmentTimes = (start, end) =>
  (start == end)
    ? (start == 0)
      ? "Full Video"
      : `${secondsToTime(start)}`
    : `${secondsToTime(start)} - ${secondsToTime(end)}`;

const timeStamp = (time) => `<t:${(""+time).substring(0,10)}:R>`;

const formatUser = (result, submitted) => {
  const embed = emptyEmbed();
  embed.title = userName(result);
  embed.url = `https://sb.ltn.fi/userid/${result.userID}/`;
  embed.description = `**Submitted:** ${result.segmentCount.toLocaleString("en-US")}
  **Reputation:** ${result.reputation.toFixed(2)}
  **Segment Views:** ${result.viewCount.toLocaleString("en-US")}
  **Time Saved:** ${minutesReadable(result.minutesSaved)}
  **Current Warnings:** ${result.warnings}
  **Ignored Submissions:** ${result.ignoredSegmentCount}
  **Ignored Views:** ${result.ignoredViewCount}
  **Last Submission:** ${timeStamp(submitted)}
  \`${result.lastSegmentID}\`
  `;
  if (result.vip) embed.color = 0x1abc9c;
  return embed;
};

const formatSegment = (result) => {
  const embed = emptyEmbed();
  const { videoID, category, startTime, endTime, UUID } = result;
  const videoLink = videoTimeLink(videoID, startTime, UUID);
  embed.title = videoID;
  embed.url = `https://sb.ltn.fi/video/${videoID}/`;
  embed.color = COLOUR_MAP[category] || COLOUR_MAP["default"];
  embed.description = `[${category}](${videoLink}) | ${actionType(result.actionType)} | **Submitted:** ${timeStamp(result.timeSubmitted)}
  ${segmentTimes(startTime, endTime)} **Length:** ${secondsToTime((endTime - startTime), false)}
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
    value: (deepEquals(categories, CATEGORY_NAMES)) ? "All" : `${categories.join("\n")}`
  }, {
    name: "Reason",
    value: (reason ? reason : "None")
  });
  return embed;
};

const formatLockReason = (videoID, result) => {
  const embed = emptyVideoEmbed(videoID);
  const active = [];
  for (const lock of result) if (lock.locked) active.push(lock);
  if (active.length === 0) {
    embed.description = "No Locked Categories";
    return embed;
  }
  for (const lock of active) {
    const user = lock.userName ? lock.userName : lock.userID;
    embed.fields.push({
      name: `${EMOJI_MAP[lock.category]} ${lock.category} | ${user}`,
      value: `${lock.reason ? lock.reason : "[no reason provided]"}`
    });
  }
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
  embed.description = `**Segments:** ${parsed.length}`;
  for (const segment of parsed) {
    const [ startTime, endTime ] = segment.segment;
    const name = segment.UUID;
    embed.fields.push({
      name,
      value: `${EMOJI_MAP[segment.category]} [${segment.category}](${videoTimeLink(videoID, startTime, name)}) | ${actionType(segment.actionType)} | ${segmentTimes(startTime, endTime)}`
    });
  }
  return embed;
};

const formatSearchSegments = (videoID, result, buttonOverrides) => {
  if (result === "Not Found") return segmentsNotFoundEmbed(videoID);
  const embed = emptyVideoEmbed(videoID);
  const parsed = JSON.parse(result);
  embed.description = `**Segments:** ${parsed.segmentCount} | **Page:**: ${parsed.page+1}/${totalPages(parsed.segmentCount)+1}`;
  embed.footer = {text: JSON.stringify(buttonOverrides || {})};
  const segments = parsed.segments;
  for (const segment of segments) {
    const { startTime, endTime } = segment;
    const name = segment.UUID;
    embed.fields.push({
      name,
      value: `${EMOJI_MAP[segment.category]} [${segment.category}](${videoTimeLink(videoID, startTime, name)}) | ${formatVote(segment)} | ${`👀 ${segment.views}`} | ${actionType(segment.actionType)} | ${segmentTimes(startTime, endTime)}`
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
      }, {
        name: "1 min /status requests",
        value: data.statusRequests,
        inline: true
      }
    );
  }
  return embed;
};

const formatResponseTime = (data) => {
  // preformatting
  let processTimes = [];
  let responseTimes = [];
  let skipResponseTimes = [];
  Object.keys(data).forEach((key) => {
    processTimes.push(data[key].sbProcessTime);
    responseTimes.push(data[key].axiosResponseTime);
    skipResponseTimes.push(data[key].skipResponseTime);
  });
  processTimes = processTimes.map((x) => x.toFixed(2) + "ms");
  responseTimes = responseTimes.map((x) => x.toFixed(2) + "ms");
  skipResponseTimes = skipResponseTimes.map((x) => x.toFixed(2) + "ms");
  const embed = emptyEmbed();
  embed.title = "SB Server Response Time";
  embed.url = "https://mchangrh.github.io/sb-status-chart";
  embed.description = "Last | 5 Minute Average | 15 Minute Average";
  embed.fields.push({
    name: "Process Time",
    value: processTimes.join(" | ")
  }, {
    name: "/status Response Time",
    value: responseTimes.join(" | ")
  }, {
    name: "/skipSegment Response Time",
    value: skipResponseTimes.join(" | ")
  });
  return embed;
};

const formatUserStats = (publicID, data, sort, piechart) => {
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
  embed.fields.push({
    name: "Category Breakdown",
    value: "```"+columnify(categoryData, columnifyConfig)+"```"
  }, {
    name: "Type Breakdown",
    value: "```"+columnify(typeData, typeConfig)+"```"
  });
  if (piechart) {
    const rand = Math.random().toString(16).substring(2,6);
    embed.image = {
      url: `https://sb-img.mchang.xyz/pie?userID=${publicID}&value=${rand}`
    };
  }
  return embed;
};

const formatUnsubmittedTemplate = (s) => {
  const videoLink = `[${s.videoID}](https://youtu.be/${s.videoID})`;
  const category = (s.category === "chooseACategory" ? "?" : s.category);
  const times = s.times
    .map((time) =>
      `\`${secondsToTime(time)}\``)
    .join(" - ");
  return `${videoLink} | ${actionType(s.type)} | ${category} | ${times}`;
};

const formatUnsubmitted = (debugObj) => {
  const segments = debugObj.config.segmentTimes;
  // filtered and remapped
  const mapped = segments
    .filter((e) => e[1][0].source == 1)
    .map((e) => {
      return {
        videoID: e[0],
        type: e[1][0].actionType,
        category: e[1][0].category,
        times: e[1][0].segment
      };
    });
  const embed = emptyEmbed();
  embed.title = "Unsubmitted Segments";
  embed.description = mapped.map((s) => formatUnsubmittedTemplate(s)).join("\n");
  embed.description += `\n\n[Playlist](https://www.youtube.com/watch_videos?video_ids=${mapped.map((s) => s.videoID).join(",")})`;
  return embed;
};

const contentResponse = (content, hide) => {
  return {
    type: 4,
    data: {
      content,
      flags: (hide ? 64 : 0)
    }
  };
};

const axiosResponse = async (result) => {
  const data = await result.text();
  return result.status == 200
    ? `| ${jsonBody(data)}`
    : `${result.status} | ${jsonBody(data)}`;
};

const jsonBody = (body) => {
  try {
    return JSON.parse(body).message;
  } catch {
    return body.length > 0 ? body : "OK";
  }
};

const formatAutomod = (aiResults) => {
  const embed = emptyEmbed();
  const videoID = aiResults.video_id;
  const url = `https://www.youtube.com/watch?v=${videoID}`;
  // setup embed
  embed.title = videoID;
  embed.url = url;
  embed.fields = [];
  for (const result of aiResults?.missed ?? []) {
    embed.fields.push(formatAutoModField(result, videoID, "Missed"));
  }
  for (const result of aiResults?.incorrect ?? []) {
    embed.fields.push(formatAutoModField(result, videoID, "Incorrect"));
  }
  return embed;
};

const intPercent = (int) => `${(int*100).toPrecision(2)}%`;

const formatAutoModField = (aiResult, videoID, type) => {
  const submitLink = `https://www.youtube.com/watch?v=${videoID}#segments=[{"segment":[${aiResult.start}, ${aiResult.end}],"category":"${aiResult.category}","actionType":"skip"}]`;
  const slicedText = aiResult.text.length >= 500 ? aiResult.text.slice(0, 500) + "..." : aiResult.text;
  const field = {
    name: `${secondsToTime(aiResult.start)}-${secondsToTime(aiResult.end)} | ${type}`,
    value: `<:sponsor:936878146156892240> ${intPercent(aiResult.probabilities.SPONSOR)} | <:selfpromo:936878146228207636> ${intPercent(aiResult.probabilities.SELFPROMO)} | <:interaction_reminder:936878145993322557> ${intPercent(aiResult.probabilities.INTERACTION)} | ❌ ${intPercent(aiResult.probabilities.null)}
    ${tripleTick+slicedText+tripleTick}
    [submit](${encodeURI(submitLink)})`
  };
  return field;
};

module.exports = {
  formatShowoff,
  formatSegment,
  formatUser,
  formatUserID,
  getLastSegmentTime,
  formatLockCategories,
  formatLockReason,
  formatSkipSegments,
  formatSearchSegments,
  formatStatus,
  formatResponseTime,
  formatUserStats,
  formatUnsubmitted,
  contentResponse,
  axiosResponse,
  formatAutomod
};
