const { contentResponse } = require("./discordResponse.js");
const invalidInput = (property) => contentResponse(`Sorry, that doesn't appear to be a valid ${property}`);

// invalid input
const invalidVideoID = invalidInput("Video ID");
const invalidPublicID = invalidInput("Public User ID");
const invalidSegment = invalidInput("Segment ID");
const noOptions = contentResponse("No options provided");

const videoIDNotFound = contentResponse("Sorry there doesn't seem to be any video links in this message");
const noStoredID = contentResponse("Sorry, there don't seem to be any set userIDs for this Discord user");
const usernameNotFound = contentResponse("Sorry, there doesn't seem to be any users with that username. The search **is** case-sensitive.");
const segmentNotFound = contentResponse("Sorry, there doesn't seem to be any segments with that ID");
const userNoSegments = contentResponse("Sorry, this user hasn't submitted any segments.");

// timeout
const timeoutResponse = contentResponse("Error: SponsorBlock server did not respond in time");

// not VIP
const notVIP = contentResponse("Sorry, this is only available to VIP users");

module.exports = {
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
