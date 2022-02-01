const { cannedReasonSelect } = require("../util/lockCommon.js");

module.exports = {
  name: "lock_reason",
  execute: ({ interaction, response }) => cannedReasonSelect({ interaction, response })
};