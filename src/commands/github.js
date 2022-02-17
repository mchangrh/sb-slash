const { embedResponse } = require ("../util/formatResponse.js");

module.exports = {
  name: "github",
  description: "Get a link for the sb-slash GitHub",
  execute: ({ response }) =>
    response(embedResponse("Visit the [GitHub](https://github.com/mchangrh/sb-slash) to report any issues, make any feature requests or fork the source code", true))
};
