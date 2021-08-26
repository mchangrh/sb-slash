# Slash Commands
### /userinfo
get user info
- publicid - Public ID of user to get info on

### /skipsegments
get a list of segments 
- videoid - YouTube ID of video to get segments for
- categories - Categories to get segments for
- json - Show JSON response (includes videoDuration)

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

### /invite
get invite link for the bot

### /github
get a link to the bot's github page

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