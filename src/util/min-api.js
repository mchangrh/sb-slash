const BASEURL = "https://sponsor.ajay.app/api";

const getSkipSegments = async (videoID, categoryParam) => {
  const url = `${BASEURL}/skipSegments?videoID=${videoID}&${categoryParam}`;
  return fetch(url).then((res) => res.text());
};

const getUserInfo = async (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}`;
  return fetch(url).then((res) => res.json());
};

const getSegmentInfo = async (segmentid) => {
  const url = `${BASEURL}/segmentInfo?UUID=${segmentid}`;
  return fetch(url).then((res) => res.json());
};

const getUserID = async (searchString, exact) => {
  const url = `${BASEURL}/userID?username=${searchString}&exact=${exact}`;
  return fetch(url);
};

module.exports = {
  getSkipSegments,
  getUserInfo,
  getSegmentInfo,
  getUserID
};
