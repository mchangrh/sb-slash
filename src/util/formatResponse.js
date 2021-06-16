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

const intEmoji = (int) => int ? '-' : '❌'

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
  **Hidden/ Shadow Hidden:** ${intEmoji(result.hidden)} / ${intEmoji(result.shadowHidden)}
  **User ID:** ${result.userID}
  `

module.exports = {
  formatUser,
  formatSegment
}
