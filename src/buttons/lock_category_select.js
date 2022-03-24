const { categorySelect } = require("../util/lockCommon.js");

module.exports = {
  name: "lock_category_select",
  execute: ({ interaction, response }) => categorySelect({ interaction, response })
};
