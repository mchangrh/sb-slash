const { submit } = require("../util/lock_common.js");

module.exports = {
  name: "lock_submit",
  execute: ({ interaction, response }) => submit({ interaction, response })
};