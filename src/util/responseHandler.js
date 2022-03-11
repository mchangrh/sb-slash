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

const responseHandler = async (response) => {
  if (!response) {
    return { success: false, error: "timeout" };
  } else if (response.status !== 200) {
    return { success: false, error: `Error ${response.status}: ${statusTextMap[response.status] ?? ""}`, code: response.status };
  }
  try {
    const data = await response.json();
    return { success: true, data};
  } catch (err) {
    if (err.name == "SyntaxError") {
      return { success: false, error: "SyntaxError", code: "SyntaxError" };
    }
  }
};

module.exports = {
  responseHandler
};