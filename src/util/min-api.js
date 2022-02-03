const BASEURL = "https://sponsor.ajay.app/api";
const timeout = scheduler.wait(2000);

const getSkipSegments = (videoID, categoryParam) => {
  const url = `${BASEURL}/skipSegments?videoID=${videoID}&${categoryParam}&actionTypes=["skip","mute"]`;
  return fetch(url).then((res) => res.text());
};

const getSearchSegments = (videoID, page, filterParam) => {
  const url = `${BASEURL}/searchSegments?videoID=${videoID}&actionTypes=["skip","mute"]&page=${page}${filterParam}`;
  return fetch(url).then((res) => res.text());
};

const getUserInfo = (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}`;
  return fetch(url).then((res) => res.json());
};

const getUserInfoShowoff = (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}&values=["segmentCount", "viewCount", "minutesSaved", "userName", "vip"]`;
  return fetch(url).then((res) => res.json());
};

const getSegmentInfo = (segmentid) => {
  const url = `${BASEURL}/segmentInfo?UUID=${segmentid}`;
  return fetch(url).then((res) => res.json());
};

const getUserID = (searchString, exact) => {
  const url = `${BASEURL}/userID?username=${searchString}&exact=${exact}`;
  return fetch(url);
};

const getLockCategories = (videoID) => {
  const url = `${BASEURL}/lockCategories?videoID=${videoID}`;
  return fetch(url).then((res) => res.text());
};

const getLockReason = (videoID) => {
  const url = `${BASEURL}/lockReason?videoID=${videoID}`;
  return fetch(url).then((res) => res.json());
};

const getStatus = () => {
  const url = `${BASEURL}/status`;
  return fetch(url);
};

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

module.exports = {
  timeout,
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
    lockCategories
  }
};
