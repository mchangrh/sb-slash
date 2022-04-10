# Slash Commands
### /userinfo
get user info
- publicid - Public ID of user to get info on
- user - discord ID/ mention of user to get info on

### /userstats
get user statistics
breakdown of categories and types, with count and percentage
- publicid - Public ID of user to get info on
- sort - sort categories by descending order
- piechart - get a visual representation of the stats

### /skipsegments
get a list of segments 
- videoid - YouTube ID of video to get segments for
- categories - Categories to get segments for

### /searchsegments
get all segments for a video based on filters
- videoid - YouTube ID of video to get segments for
- page - page number to start at

Filters (threshold to reach to be included in result)
- minvotes - min # of votes
- maxvotes - max # of votes
- minviews - min # of views
- maxviews - max # of views
- locked - show locked segments
- hidden - show hidden segments
- ignored - show ignored segments (hidden or downvoted)

### /showoff
show off your stats in a format similar to the extension
- publicid - Public ID of user to get info on

### /segmentinfo
get information about a segment
- segmentid - UUID of segment to get info on

### /userid
find your publicID from username
- username - start of string to search with'
- exact - If the match should be exact or have wildcards

### /lockcategories
- videoid - ID of video to lock categories for

### /status
get status of the server

### /responsetime
get response time of the server via 3rd party API

### /invite
get invite link for the bot

### /github
get a link to the bot's github page

### /me
run commands agianst your stored userID
- userid
  - set - associate discordID with publicID
  - get - get associated publicID
- [userinfo](#userinfo)
- [showoff](#showoff)
- [userstats](#userstats)

To delete the assocation with your discord ID, run `/me userid set delete` or replace your publicID with delete.

### /automod
Get segment suggestions from [Xenova's Sponsorblock ML](https://github.com/xenova/sponsorblock-ml)
- get - get suggestions for a video
- load - load suggestions from AI evaluation
- info - get info about automod suggestions
- acceptterms - Accept [disclaimer](https://wiki.sponsor.ajay.app/w/Automating_Submissions) for automated/ segments

### /formatunsubmitted
format unsubmitted segments from debug

upload the debug here (https://mchangrh.github.io/cfkv-bin/)

- binid: bin ID to fetch debug from

### /shareunsubmitted
share unsubmitted segments from deubg and for a video

upload the debug here (https://mchangrh.github.io/cfkv-bin/)

- binid: bin ID to fetch from
- videoID: videoID to share segments from

## /previewvideo
get a rough preview of the preview bar for a video with emoji

- videoID: videoID to get segments from
- spots: number of emoji to show

### [/vip](./vip.md)

# Message Commands
### Lookup Segments
find videoIDs or sb.mchang.xyz links in a message and lookup segments for that video.

### Open in sb.ltn.fi
find videoIDs or sb.mchang.xyz links in a message and create a link for sb.ltn.fi

# User Commands
### Lookup userinfo
run /userinfo agianst targeted user

# Misc Endpoints
### /ping
pong

### /version
which github short hash the bot is running

### /invite
generates an invite link for the bot

### /
Redirect to the readme