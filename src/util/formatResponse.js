const columnify = require("columnify");
const { getSegmentInfo } = require("./min-api.js");
const { parseUserAgent } = require("./parseUserAgent.js");
const { CATEGORY_NAMES, COLOUR_MAP, EMOJI_MAP } = require("sb-category-type");

// constant modifications
COLOUR_MAP.default = 0xFF0000;

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
        : "✅ Visible";

const formatVote = (result) =>
  (result.hidden) ? "❌"
    : (result.shadowHidden) ? "🚫"
      : (result.votes <= -2) ? "👎"
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
  const canSubmit = result.permissions.filler
  embed.description = `**Submitted:** ${result.segmentCount.toLocaleString("en-US")}
  **Reputation:** ${result.reputation.toFixed(2)}
  **Segment Views:** ${result.viewCount.toLocaleString("en-US")}
  **Time Saved:** ${minutesReadable(result.minutesSaved)}
  **Current Warnings:** ${result.warnings}
  **Ignored Submissions:** ${result.ignoredSegmentCount}
  **Ignored Views:** ${result.ignoredViewCount}
  **Submission Permission:** ${canSubmit ? "✅" : "❌"}`;
  if (submitted !== null) {
    embed.description += `
    **Last Submission:** ${timeStamp(submitted)}
    \`${result.lastSegmentID}\`
    `;
  }
  if (result.vip) embed.color = 0x1abc9c;
  return embed;
};

const formatSegment = (result) => {
  const { videoID, category, startTime, endTime, UUID } = result;
  const videoLink = videoTimeLink(videoID, startTime, UUID);
  const embed = {
    ...emptyEmbed(),
    title: videoID,
    url: `https://sb.ltn.fi/video/${videoID}/`,
    color: COLOUR_MAP[category] || COLOUR_MAP["default"]
  };
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
  return {
    ...emptyEmbed(),
    title: userName(result),
    url: `https://sb.ltn.fi/userid/${publicID}/`,
    description: `**Submissions:** ${result.segmentCount.toLocaleString("en-US")}
  You've saved people from **${result.viewCount.toLocaleString("en-US")}** segments
  (**${minutesReadable(result.minutesSaved)}** of their lives)`
  };
};

const formatUserID = (result) => {
  const embed = emptyEmbed();
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
  const segmentParse = await getSegmentInfo(lastSegmentID)
    .then((res) => res.json())
    .catch(() => null);
  return segmentParse?.[0]?.timeSubmitted;
}

const deepEquals = (a,b) => {
  let result = true;
  b.forEach((e) => {
    if (!a.includes(e)) result = false;
  });
  return result;
};

const formatLockCategories = (videoID, data) => {
  const embed = emptyVideoEmbed(videoID);
  const { categories, reason } = data;
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
  const isSameUser = active.every((lock) => lock.userID === active[0].userID);
  const isSameReason = active.every((lock) => lock.reason === active[0].reason);
  if (isSameUser && isSameReason) {
    const categories = active.map((lock) => EMOJI_MAP[lock.category]);
    embed.fields = [{
      name: `${categories.join("")} | ${active[0]?.userName ?? active[0].userID}`,
      value: active[0]?.reason ?? "-"
    }];
  } else {
    // filter out lock duplicates
    for (const lock of active) {
      const user = lock?.userName ?? lock.userID;
      embed.fields.push({
        name: `${EMOJI_MAP[lock.category]} ${lock.category} | ${user}`,
        value: `${lock?.reason ?? "-"}`
      });
    }
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

const formatSkipSegments = (videoID, parsed) => {
  const embed = emptyVideoEmbed(videoID);
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

const formatSearchSegments = (videoID, parsed, buttonOverrides) => {
  const segments = parsed.segments;
  const embed = {
    ...emptyVideoEmbed(videoID),
    description: `**Segments:** ${parsed.segmentCount} | **Page:**: ${parsed.page+1}/${totalPages(parsed.segmentCount)+1}`,
    footer: { text: JSON.stringify(buttonOverrides || {}) }
  };
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
  const embed = {
    ...emptyEmbed(),
    title: "SponsorBlock Server Status",
    url: "https://status.sponsor.ajay.app/"
  };
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
        name: "1 min /status requests",
        value: data.statusRequests,
        inline: true
      }
    );
  }
  return embed;
};

const formatTime = (time) => {
  if (time >= 60000) {
    return (time/60000).toFixed(2) + "m";
  } else if (time >= 1000) {
    return (time/1000).toFixed(2) + "s";
  } else {
    return time.toFixed(2) + "ms";
  }
} ;

const formatResponseTime = (data) => {
  // preformatting
  const embed = {
    title: "SB Server Response Graph",
    url: "https://graph.sb.mchang.xyz",
    description: "Last | 5 Minute Average | 15 Minute Average"
  };
  try {
    let processTimes = [];
    let responseTimes = [];
    let skipResponseTimes = [];
    Object.keys(data).forEach((key) => {
      processTimes.push(data[key].sbProcessTime);
      responseTimes.push(data[key].axiosResponseTime);
      skipResponseTimes.push(data[key].skipResponseTime);
    });
    const maxTime = Math.max(...processTimes, ...responseTimes, ...skipResponseTimes);
    embed.color = (maxTime > 1000) ? 0xff0000 : (maxTime > 500) ? 0xff7f00 : 0x00ff00;
    const time = (x) => (x >= 1000 ? "💀 " : "") + formatTime(x);
    processTimes = processTimes.map(time);
    responseTimes = responseTimes.map(time);
    skipResponseTimes = skipResponseTimes.map(time);
    embed.fields = [{
      name: "Process Time",
      value: processTimes.join(" | ")
    }, {
      name: "/status Response Time",
      value: responseTimes.join(" | ")
    }, {
      name: "/skipSegment Response Time",
      value: skipResponseTimes.join(" | ")
    }];
    return embed;
  } catch {
    embed.description = "Server did not respond with a normal response";
    embed.color = 0xff0000;
    return embed;
  }
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
  const embed = {
    ...emptyEmbed(),
    title: data.userName,
    url: `https://sb.ltn.fi/userid/${publicID}/`,
    description: `**Total Segments:** ${total}\n **Time Saved:** ${timeSaved}`
  };
  embed.fields.push({
    name: "Category Breakdown",
    value: "```"+columnify(categoryData, columnifyConfig)+"```"
  }, {
    name: "Type Breakdown",
    value: "```"+columnify(typeData, typeConfig)+"```"
  });
  if (piechart) {
    const rand = Math.random().toString(16).substring(2,6);
    embed.image = { url: `https://img.sb.mchang.xyz/pie?userID=${publicID}&value=${rand}` };
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
  // filtered and remapped
  const filtered = [];
  for (const [key, value] of Object.entries(debugObj)) {
    for (const segment of value) {
      if (segment.source !== 1) continue;
      filtered.push({
        videoID: key,
        type: segment.actionType,
        category: segment.category,
        times: segment.segment
      });
    }
  }
  const embed = {
    ...emptyEmbed(),
    title: "Unsubmitted Segments",
    description: filtered.map((s) => formatUnsubmittedTemplate(s)).join("\n")
  };
  const videoIDs = [...new Set(filtered.map((s) => s.videoID))];
  embed.description += `\n\n[Playlist](https://www.youtube.com/watch_videos?video_ids=${videoIDs.join(",")})`;
  return embed;
};

const shareUnsubmitted = (debugObj, videoID) => {
  const segments = debugObj[videoID];
  if (segments.length === 0) return false;
  segments.map((r) => {
    delete r.UUID;
    delete r.source;
    return r;
  });
  const submitLink = `https://www.youtube.com/watch?v=${videoID}#segments=${JSON.stringify(segments)}`;
  return submitLink;
};

const axiosResponse = async (result) => {
  const data = await result.text();
  return result.ok
    ? `| ${jsonBody(data)}`
    : `${result.status} | ${jsonBody(data)}`;
};

const jsonBody = (body) => {
  try {
    return JSON.parse(body).message;
  } catch {
    return body.length > 0 ? body : "No Response";
  }
};

const formatAutomodInfo = (data) => {
  // format response
  const { total, batches } = data;
  delete data.total;
  delete data.batches;
  const percentage = (value) => total ? ((value/total)*100).toFixed(2)+"%" : "0%";
  const columnifyConfig = {
    columnSplitter: " | ",
    showHeaders: false
  };
  let dbStats = [];
  for (const [key, value] of Object.entries(data)) {
    dbStats.push({key, value, a:percentage(value)});
  }
  // sort
  dbStats = dbStats.sort((a,b) => b.value-a.value);
  // send result
  const embed = {
    ...emptyEmbed(),
    title: "Automod Database Stats",
    description: `**Total**: ${total}
    **Accuracy**: ${((data.done/(data.done+data.rejected))*100).toFixed(2)}%
    **Batches**: ${batches}
    `,
    fields: [{
      name: "Breakdown",
      value: "```"+columnify(dbStats, columnifyConfig)+"```"
    }]
  };
  return embed;
};

const formatClassifyInfo = (data) => {
  const { total } = data;
  // format response
  const percentage = (value) => total ? ((value/total)*100).toFixed(2)+"%" : "0%";
  const columnifyConfig = {
    columnSplitter: " | ",
    showHeaders: false
  };
  let dbStats = [];
  for (const [key, value] of Object.entries(data)) {
    dbStats.push({key, value, a:percentage(value)});
  }
  // sort
  dbStats = dbStats.sort((a,b) => b.value-a.value);
  // send result
  const embed = {
    ...emptyEmbed(),
    title: "Classify Database Stats",
    description: `**Total**: ${total}
    **Accuracy**: ${((data.done/(data.done+data.rejected))*100).toFixed(2)}%
    `,
    fields: [{
      name: "Breakdown",
      value: "```"+columnify(dbStats, columnifyConfig)+"```"
    }]
  };
  return embed;
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
  axiosResponse,
  secondsToTime,
  formatAutomodInfo,
  formatClassifyInfo,
  segmentsNotFoundEmbed,
  emptyEmbed,
  emptyVideoEmbed,
  shareUnsubmitted
};
