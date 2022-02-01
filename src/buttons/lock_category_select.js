const { categorySelect } = require("../util/lock_common.js");

module.exports = {
  name: "lock_category_select",
  execute: ({ interaction, response }) => {
    return categorySelect({ interaction, response });
  }
};