const BASEURL = "https://leaderboard.sbstats.uk";

const getTrueVotes = (segmentid) =>
  fetch(`${BASEURL}/true_votes?segment_ID=${segmentid}`);

module.exports = {
  getTrueVotes
};
