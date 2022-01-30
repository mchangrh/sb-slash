const { common } = require("./searchsegments_prev.js");

module.exports = {
  name: "lookupsegment",
  execute: ({ interaction, response }) => {
    return common({ interaction, response, offset: 1 });
  }
};