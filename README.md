# sb-slash
Retrieve [SponsorBlock](https://github.com/ajayyy/SponsorBlock) segments and user info with slash commands, buttons and message commands.

[Invite](https://slash.sb.blabdu.de/invite)

## slash commands
```
# users
/userinfo publicid: user:
/showoff publicid:
/userstats publicid: sort:
/userid username: exact:

# segments
/skipsegments videoid: categories: json:
/segmentinfo segmentid:
/lockcategories videoid:
/searchsegments videoid:
/status
/responsetime

# /me
userid set / get
userinfo
showoff
userstats

# /automod
get
share videoid:
info
acceptterms

# /vip
category uuid: category:
cache videoid:
purge videoid:
downvote uuid:
undovote uuid:
addvip userID: videoID:
banstatus publicid:

# misc
/formatunsubmitted binid:
/shareunsubmitted binid: videoid:
/previewvideo videoid: spots:
/invite
/github
```
more details [here](./docs/commands.md)

- Mass stat related commands were not included  
- Anonymous lookup was not included
- Most commands can have their response be ephemeral by setting the hide parameter to true

## Cloudflare Environment Variables (Handling Interactions)
`CLIENT_ID` - Client ID from bot portal  
`CLIENT_PUBLIC_KEY` - Public Key from bot portal  
`LOGGING_WEBHOOK` - Webhook URL for VIP logging  
`VIP_USER_ID` - Private userID for VIP commands  
`ML_AUTH` - sb-ml auth token  
`VIP_NONCE` - nonce to check VIP users against

## Local Environment Variables (Populating slash commands & options)
`CLIENT_ID` - Client ID from bot portal  
`BOT_TOKEN` - Bot Token from bot portal  
`CLIENT_PUBLIC_KEY` - Public key from bot portal

## PR Testing
If you would like to test your PR on a dev environment, please contact me on discord and I can give you access to the private testing repository

# Credit
API follows [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) Documentation at [wiki.sponsor.ajay.app](https://wiki.sponsor.ajay.app/index.php/API_Docs)

utilities from [MRuy/sponsorBlockControl](https://github.com/MRuy/sponsorBlockControl/blob/master/src/utils.js)

Logo from [ajayyy/SponsorBlock](https://github.com/ajayyy/SponsorBlock/tree/master/public/icons), created by [@munadikieh](https://github.com/munadikieh)

Formatting and Links from [Lartza/SBbrowser](https://github.com/Lartza/SBbrowser)
