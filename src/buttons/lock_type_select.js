const { typeSelect } = require("../util/lock_common.js");

module.exports = {
  name: "lock_type_select",
  execute: ({ interaction, response }) => {
    return typeSelect({ interaction, response });
  }
};