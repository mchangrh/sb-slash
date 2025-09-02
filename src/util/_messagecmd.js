const lookupSegments = require("../msgcommands/lookupSegments.js");
const openinsbltnfi = require("../msgcommands/openinsbltnfi.js");

module.exports = {
  messageCommands: {
    "Lookup Segments": lookupSegments,
    "Open in sb.ltn.fi": openinsbltnfi
  }
};
