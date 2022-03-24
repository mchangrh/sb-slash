const { submit } = require("../util/lockCommon.js");

module.exports = {
  name: "lock_submit",
  execute: ({ interaction, response }) => submit({ interaction, response })
};
