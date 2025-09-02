const automod_accept = require("../buttons/automod_accept.js");
const automod_deny = require("../buttons/automod_deny.js");
const automod_done = require("../buttons/automod_done.js");
const automod_reject = require("../buttons/automod_reject.js");
const automod_skip = require("../buttons/automod_skip.js");
const classify_done = require("../buttons/classify_done.js");
const classify_flag = require("../buttons/classify_flag.js");
const classify_ignore = require("../buttons/classify_ignore.js");
const classify_reject = require("../buttons/classify_reject.js");
const classify_skip = require("../buttons/classify_skip.js");
const classify_vip = require("../buttons/classify_vip.js");
const lock_category_select = require("../buttons/lock_category_select.js");
const lock_reason = require("../buttons/lock_reason.js");
const lock_submit = require("../buttons/lock_submit.js");
const lock_type_select = require("../buttons/lock_type_select.js");
const lookupsegment = require("../buttons/lookupsegment.js");
const lookupuser = require("../buttons/lookupuser.js");
const searchsegments_next = require("../buttons/searchsegments_next.js");
const searchsegments_prev = require("../buttons/searchsegments_prev.js");
const suslist_ban = require("../buttons/suslist_ban.js");

module.exports = {
  buttons: {
    automod_accept,
    automod_deny,
    automod_done,
    automod_reject,
    automod_skip,
    classify_done,
    classify_flag,
    classify_ignore,
    classify_reject,
    classify_skip,
    classify_vip,
    lock_category_select,
    lock_reason,
    lock_submit,
    lock_type_select,
    lookupsegment,
    lookupuser,
    searchsegments_next,
    searchsegments_prev,
    suslist_ban
  }
};
