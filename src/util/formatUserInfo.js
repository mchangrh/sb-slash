const sbcutil = require('../util/sbc-util.js')

const userName = (result) => {
  result.vip ? `[VIP] ${result.userName}` : result.userName
}

const format = (result) => {
  `${userName(result)}
  **Submitted:** ${result.segmentCount}
  **Warnings:** ${result.warnings}
  **Reputation:** ${result.reputation}
  **Segment Views:** ${result.viewCount}
  **Time Saved:** ${sbcutil.minutesReadable(result.minutesSaved)}
  `
}

module.exports = {
  format
}
