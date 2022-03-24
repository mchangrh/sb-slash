const { typeSelect } = require("../util/lockCommon.js");

module.exports = {
  name: "lock_type_select",
  execute: ({ interaction, response }) => typeSelect({ interaction, response })
};
