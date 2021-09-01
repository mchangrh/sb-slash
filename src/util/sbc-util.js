// https://github.com/MRuy/sponsorBlockControl/blob/61f0585c9bff9c46f6fde06bb613aadeffb7e189/src/utils.js
const minutesReadable = (minutes, useLong = false) => {
  const years = Math.floor(minutes / 60 / 24 / 365);
  const days = Math.floor(minutes / 60 / 24) % 365;
  const hours = Math.floor(minutes / 60) % 24;
  let str = "";
  str += `${years > 0 ? years + (useLong ? " years " : "y ") : ""}`;
  str += `${days > 0 ? days + (useLong ? " days " : "d ") : ""}`;
  str += `${hours > 0 ? hours + (useLong ? " hours " : "h ") : ""}`;
  if (years == 0) {
    str += `${(minutes % 60).toFixed(1)}${useLong ? " minutes " : "m "}`;
  }
  return str.trim();
};
const isValidUserUUID = (str) => /[a-f0-9]{64}/.test(str);
const isValidSegmentUUID = (str) =>  /^([a-f0-9]{64,65}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/.test(str);

module.exports = {
  minutesReadable,
  isValidUserUUID,
  isValidSegmentUUID
};
