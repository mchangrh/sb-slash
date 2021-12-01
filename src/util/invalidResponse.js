const defaultResponse = (content) => ({
  type: 4,
  data: {
    content,
    flags: 64
  }
});

// invalid input
const invalidInput = (property) => defaultResponse(`Sorry, that doesn't appear to be a valid ${property}`);
const invalidVideoID = invalidInput("Video ID");
const invalidPublicID = invalidInput("Public User ID");
const invalidSegment = invalidInput("Segment ID");

const videoIDNotFound = defaultResponse("Sorry there doesn't seem to be any video links in this message");
const noStoredID = defaultResponse("Sorry, there don't seem to be any set userIDs for this Discord user");
const usernameNotFound = defaultResponse("Sorry, there doesn't seem to be any users with that username. The search **is** case-sensitive.");
const segmentNotFound = defaultResponse("Sorry, there doesn't seem to be any segments with that ID");

module.exports = {
  defaultResponse,
  invalidSegment,
  invalidPublicID,
  invalidVideoID,
  noStoredID,
  segmentNotFound,
  usernameNotFound,
  videoIDNotFound
};