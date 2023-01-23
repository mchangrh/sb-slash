const susListComponents = [{
  type: 1,
  components: [{
    type: 2,
    label: "Ban User",
    style: 4,
    custom_id: "suslist_ban",
    emoji: { name: "🔨" }
  }]
}];

const bannedComponents = [{
  type: 1,
  components: [{
    type: 2,
    label: "User Already Banned",
    disabled: true,
    style: 2,
    custom_id: "suslist_null",
    emoji: { name: "🔨" }
  }]
}];

module.exports = {
  susListComponents,
  bannedComponents
};
