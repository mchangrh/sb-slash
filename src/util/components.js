const SBTOOLSURL = "https://sb.ltn.fi"

const userComponents = (publicid) => [{
  type: 1,
  components: [{
    type: 2,
    label: "Lookup Last Submission",
    style: 1,
    custom_id: "lookupsegment"
  },{
    type: 2,
    label: "Open in Browser",
    style: 5,
    url: `${SBTOOLSURL}/userid/${publicid}`
  }],
}]

const segmentComponents = (videoID) => [{
  type: 1,
  components: [{
    type: 2,
    label: "Lookup User",
    style: 1,
    custom_id: "lookupuser"
  },{
    type: 2,
    label: "Open Video",
    style: 5,
    url: `${SBTOOLSURL}/video/${videoID}`
  }
],
}]

module.exports = {
  userComponents,
  segmentComponents
}
