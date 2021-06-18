const sbcutil = require("./sbc-util");

const userName = (result) => result.vip ? `[VIP] ${result.userName}` : result.userName;

const durationFormat = (duration) => {
  // split ms
  const ms = (duration+"").split(".")[1];
  // convert seconds
  const hms = new Date(duration * 1000).toISOString().substr(11,8);
  return `${hms}${ms ? "."+ms : ""}`;
};

const formatDate = (date) => {
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
  if (result.votes <= -2) return "❌ Downvoted"; // if votes <=2
  if (result.hidden) return "❌ Hidden"; // if hidden
  if (result.shadowHidden) return "❌ Shadowhidden"; // if shadowHidden
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
  **Ignored Views:** ${result.ignoredViewCount.toLocaleString("en-US")}
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
  **Hidden:** ${hidden(result)}
  **User ID:** \`${result.userID}\`
  `;

const formatShowoff = (result) => 
  `${userName(result)}
 **Submissions:** ${result.segmentCount.toLocaleString("en-US")}
  You"ve saved people from **${result.viewCount.toLocaleString("en-US")}** segments
  (**${sbcutil.minutesReadable(result.minutesSaved)}** of their lives)
  `;

module.exports = {
  formatUser,
  formatSegment,
  formatShowoff
};
