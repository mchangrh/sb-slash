const sbcutil = require('./sbc-util')

const userName = (result) => result.vip ? `[VIP] ${result.userName}` : result.userName

const formatDate = (date) => {
  const dateObj = new Date(date)
  return dateObj.toISOString().replace(/T/, ' ').replace(/\..+/, '')
}

const formatVote = (result) => {
  let votes = result.votes
  if (result.votes <= -2) votes += ' ❌' // hidden
  if (result.locked) votes += ' 👑' // locked
  return votes
}

const hidden = (result) => {
  if (result.votes <= -2) return `❌ Downvoted` // if votes <=2
  if (result.hidden) return `❌ Hidden` // if hidden
  if (result.shadowHidden) return `❌ Shadowhidden` // if shadowHidden
  return "Not Hidden"
}

const formatUser = (result) => 
 `${userName(result)}
  **Submitted:** ${result.segmentCount}
  **Reputation:** ${result.reputation.toFixed(2)}
  **Segment Views:** ${result.viewCount}
  **Time Saved:** ${sbcutil.minutesReadable(result.minutesSaved)}
  **Warnings:** ${result.warnings}
  **Ignored Submissions:** ${result.ignoredSegmentCount}
  **Ignored Views:** ${result.ignoredViewCount}
  **Last Submission:** \`${result.lastSegmentID}\`
  `

const formatSegment = (result) =>
  `**Submitted:** ${formatDate(result.timeSubmitted)}
  **Video ID:** ${result.videoID}
  **Start:** ${result.startTime}
  **End:** ${result.endTime}
  **Length:** ${(result.endTime - result.startTime).toFixed(2)}
  **Votes:** ${formatVote(result)}
  **Views:** ${result.views}
  **Category:** ${result.category}
  **Hidden:** ${hidden(result)}
  **User ID:** ${result.userID}
  `

module.exports = {
  formatUser,
  formatSegment
}
