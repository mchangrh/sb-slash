const defaultResponse = (content) => ({
  type: 4,
  data: { content, flags: 64 }
});

const showResponse = (content) => ({
  type: 4,
  data: { content }
});

// invalid input
const invalidInput = (property) => defaultResponse(`Sorry, that doesn't appear to be a valid ${property}`);
const invalidVideoID = invalidInput("Video ID");
const invalidPublicID = invalidInput("Public User ID");
const invalidSegment = invalidInput("Segment ID");
const noOptions = defaultResponse("No options provided");

const videoIDNotFound = defaultResponse("Sorry there doesn't seem to be any video links in this message");
const noStoredID = defaultResponse("Sorry, there don't seem to be any set userIDs for this Discord user");
const usernameNotFound = defaultResponse("Sorry, there doesn't seem to be any users with that username. The search **is** case-sensitive.");
const segmentNotFound = defaultResponse("Sorry, there doesn't seem to be any segments with that ID");

// timeout
const timeoutResponse = showResponse("Error: SponsorBlock server did not respond in time");

// not VIP
const notVIP = defaultResponse("Sorry, this is only available to VIP users");

module.exports = {
  defaultResponse,
  timeoutResponse,
  invalidSegment,
  invalidPublicID,
  invalidVideoID,
  noStoredID,
  segmentNotFound,
  usernameNotFound,
  videoIDNotFound,
  noOptions,
  notVIP
};