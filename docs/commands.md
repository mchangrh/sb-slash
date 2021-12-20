# Slash Commands
### /userinfo
get user info
- publicid - Public ID of user to get info on

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
- json - Show JSON response (includes videoDuration)

### /searchsegments
get all segments for a video based on filters
- videoid - YouTube ID of video to get segments for
- page - page number to start at
- json - response in JSON format

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

To delete the assocation with your discord ID, run `/me userid set delete` - or replace your publicID with delete.

### /formatunsubmitted
format unsubmitted segments from debug log

1. upload the debug here (https://mchangrh.github.io/cfkv-bin/) will try to open up to more raw text hosting services

- binid: bin ID to fetch debug from

# Message Commands
### Lookup Segments
find videoIDs in a message and lookup segments for that video.

### Open in sb.ltn.fi
find videoIDs in a message and create a link for sb.ltn.fi

# Misc Endpoints
### /ping
pong

### /version
which github short hash the bot is running

### /invite
generates an invite link for the bot

### /vip
redirects you to the API for finding publicID from privateID

### /
Redirect to the readme