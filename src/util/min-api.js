const BASEURL = "https://sponsor.ajay.app/api";

exports.getSkipSegments = async (videoID, categoryParam) => {
  const url = `${BASEURL}/skipSegments?videoID=${videoID}&${categoryParam}`;
  return fetch(url).then((res) => res.text());
};

exports.getUserInfo = async (publicid) => {
  const url = `${BASEURL}/userInfo?publicUserID=${publicid}`;
  return fetch(url).then((res) => res.text());
};

exports.getSegmentInfo = async (segmentid) => {
  const url = `${BASEURL}/segmentInfo?UUID=${segmentid}`;
  return fetch(url).then((res) => res.text());
};
