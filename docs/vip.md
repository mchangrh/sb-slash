# /vip Commands
These commands can only be executed by users with the VIP role

### category
Change segment category
- uuid - UUID of segment to change
- category - target category of segment

### cache
Clear redis cache for videoID
- videoid - ID of video to purge cache for

### purge
Purge all segments on a video
- videoid - ID of video to purge

### downvote
Downvote a segment
- uuid - UUID of segment to downvote

### undovote
Undo a downvote on a segment
- uuid - UUID of segment to undovote

### addvip
add a temporary vip for a certain channel
- userID - publicID of user to grant temp VIP to
- videoID - videoID from channel to grant temp VIP for

## Logging
downvote, undovote, purge, and addvip are all logged to a VIP-only channel since otherwise, these command executions could not be traced back to the VIP user.

If you would like to retain your vote anonymity, [SponsorBlockControl](https://mruy.github.io/sponsorBlockControl/) offers more features without the semi-public logging.