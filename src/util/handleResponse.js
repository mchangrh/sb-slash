const { contentResponse } = require("../util/discordResponse.js");

// response handler
const statusTextMap = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  409: "Conflict",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported"
};

const handleResponse = async (successfunc, subreq, hide = true) => {
  if (!subreq) {
    return contentResponse("Error: SponsorBlock server did not respond in time");
  } else if (subreq.status === 404) {
    return contentResponse("Error 404: Not Found", hide);
  } else if (subreq.status !== 200) {
    return contentResponse(`Error ${subreq.status}: ${statusTextMap[subreq.status] ?? ""}`);
  }
  // success
  try {
    const data = await subreq.json();
    return await successfunc(data);
  } catch (err) {
    return contentResponse("Error: Syntax Error ");
  }
};

module.exports = {
  handleResponse
};
