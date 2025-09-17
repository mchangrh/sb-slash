const automod = require("../commands/automod.js");
const classify = require("../commands/classify.js");
const formatunsubmitted = require("../commands/formatunsubmitted.js");
const github = require("../commands/github.js");
const invite = require("../commands/invite.js");
const lockcategories = require("../commands/lockcategories.js");
const lockreason = require("../commands/lockreason.js");
const me = require("../commands/me.js");
const previewvideo = require("../commands/previewvideo.js");
const responsetime = require("../commands/responsetime.js");
const searchsegments = require("../commands/searchsegments.js");
const segmentinfo = require("../commands/segmentinfo.js");
const shareunsubmitted = require("../commands/shareunsubmitted.js");
const showoff = require("../commands/showoff.js");
const skipsegments = require("../commands/skipsegments.js");
const skipsegmentsbyhash = require("../commands/skipsegmentsbyhash.js");
const status = require("../commands/status.js");
const userid = require("../commands/userid.js");
const userinfo = require("../commands/userinfo.js");
const userstats = require("../commands/userstats.js");
const vip = require("../commands/vip.js");
const viplang = require("../commands/viplang.js");
const truevotes = require("../commands/truevotes.js");

module.exports = {
  commands: {
    automod,
    classify,
    formatunsubmitted,
    github,
    invite,
    lockcategories,
    lockreason,
    me,
    previewvideo,
    responsetime,
    searchsegments,
    segmentinfo,
    shareunsubmitted,
    showoff,
    skipsegments,
    skipsegmentsbyhash,
    status,
    userid,
    userinfo,
    userstats,
    vip,
    viplang,
    truevotes
  }
};
