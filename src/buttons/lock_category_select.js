const { categorySelect } = require("../util/lockCommon.js");

module.exports = {
  name: "lock_category_select",
  execute: ({ interaction, response }) => {
    return categorySelect({ interaction, response });
  }
};