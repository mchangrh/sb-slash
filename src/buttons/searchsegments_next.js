const { common } = require("./searchsegments_prev.js");

module.exports = {
  name: "searchsegments_next",
  execute: ({ interaction, response }) => common({ interaction, response, offset: 1 })
};
