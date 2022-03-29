const { contentResponse } = require("./discordResponse.js");
const { timeoutResponse } = require("./invalidResponse.js");

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
    return timeoutResponse;
  } else if (subreq.status === 404) {
    return contentResponse("Error 404: Not Found", hide);
  } else if (subreq.status < 200 || subreq.status >= 400) {
    return contentResponse(`Error ${subreq.status}: ${statusTextMap[subreq.status] ?? ""}`);
  }
  // success
  try {
    const data = await subreq.json();
    return await successfunc(data);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return contentResponse("Error: Syntax Error ");
    } else {
      throw err;
    }
  }
};

module.exports = {
  handleResponse
};
