const { cannedReasonSelect } = require("../util/lock_common.js");

module.exports = {
  name: "lock_reason",
  execute: ({ interaction, response }) => {
    return cannedReasonSelect({ interaction, response });
  }
};