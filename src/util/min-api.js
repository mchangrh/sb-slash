const BASEURL = "https://sponsor.ajay.app/api";
const { TYPES } = require("sb-category-type");
const typesString = `&actionTypes=${JSON.stringify(TYPES)}`;

const getSkipSegments = (videoID, categoryParam) =>
  fetch(`${BASEURL}/skipSegments?videoID=${videoID}&${categoryParam}${typesString}`);

const getSearchSegments = (videoID, page, filterParam) =>
  fetch(`${BASEURL}/searchSegments?videoID=${videoID}${typesString}&page=${page}${filterParam}`);

const getUserInfo = (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}`;
  return fetch(url).then((res) => res.json());
};

const getUserInfoShowoff = (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}&values=["segmentCount", "viewCount", "minutesSaved", "userName", "vip"]`;
  return fetch(url).then((res) => res.json());
};

const getSegmentInfo = (segmentid) =>
  fetch(`${BASEURL}/segmentInfo?UUID=${segmentid}`);

const getUserID = (searchString, exact) =>
  fetch(`${BASEURL}/userID?username=${searchString}&exact=${exact}`);

const getLockCategories = (videoID) => {
  const url = `${BASEURL}/lockCategories?videoID=${videoID}`;
  return fetch(url).then((res) => res.text());
};

const getLockReason = (videoID) => {
  const url = `${BASEURL}/lockReason?videoID=${videoID}`;
  return fetch(url).then((res) => res.json());
};

const getStatus = () => fetch(`${BASEURL}/status`);

const getUserStats = (userID) => {
  const url = `${BASEURL}/userStats?publicUserID=${userID}&fetchCategoryStats=true&fetchActionTypeStats=true`;
  return fetch(url).then((res) => res.json());
};

const getResponseTime = () => {
  const url = "https://sb-status.mchang.xyz/all";
  return fetch(url).then((res) => res.json());
};

// vip endpoints
const postPurgeSegments = (videoID) => {
  const url = `${BASEURL}/purgeAllSegments`;
  const JSONBody = {
    videoID,
    userID: VIP_USER_ID
  };
  const req = {
    body: JSON.stringify(JSONBody),
    headers: { "content-type": "application/json;charset=UTF-8" },
    method: "POST"
  };
  return fetch(url, req);
};
const postClearCache = (videoID) => {
  const url = `${BASEURL}/clearCache?videoID=${videoID}&userID=${VIP_USER_ID}`;
  return fetch(url, { method: "POST" });
};
const postChangeCategory = (UUID, category) => {
  const url = `${BASEURL}/voteOnSponsorTime?UUID=${UUID}&category=${category}&userID=${VIP_USER_ID}`;
  return fetch(url, { method: "POST" });
};
const postVoteOnSegment = (UUID, type) => {
  const url = `${BASEURL}/voteOnSponsorTime?UUID=${UUID}&type=${type}&userID=${VIP_USER_ID}`;
  return fetch(url, { method: "POST" });
};
const postAddTempVIP = (userID, videoID) => {
  const url = `${BASEURL}/addUserAsTempVIP?adminUserID=${VIP_USER_ID}&userID=${userID}&channelVideoID=${videoID}&enabled=true`;
  return fetch(url, { method: "POST"});
};
const deleteWarning = (userID) => {
  const url = `${BASEURL}/warnUser`;
  const JSONBody = {
    userID,
    issuerUserID: VIP_USER_ID,
    enabled: false
  };
  const req = {
    body: JSON.stringify(JSONBody),
    headers: { "content-type": "application/json;charset=UTF-8" },
    method: "POST"
  };
  return fetch(url, req);
};
const lockCategories = (body) => {
  const url = `${BASEURL}/lockCategories`;
  // append userID to budy
  body.userID = VIP_USER_ID;
  const req = {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json;charset=UTF-8" },
    method: "POST"
  };
  return fetch(url, req);
};
const getBanStatus = (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}&value=banned`;
  return fetch(url).then((res) => res.json());
};

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
  TIMEOUT: 2500,
  getResponseTime,
  getSkipSegments,
  getSearchSegments,
  getUserInfo,
  getUserInfoShowoff,
  getSegmentInfo,
  getUserID,
  getLockCategories,
  getLockReason,
  getStatus,
  getUserStats,
  vip: {
    postPurgeSegments,
    postClearCache,
    postChangeCategory,
    postVoteOnSegment,
    postAddTempVIP,
    deleteWarning,
    lockCategories,
    getBanStatus
  },
  responseHandler
};
