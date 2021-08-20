# sb-slash
Retrieve [SponsorBlock](https://github.com/ajayyy/SponsorBlock) segments and user info with slash commands (and buttons!)

[Invite](https://sb-slash.mchang.workers.dev/invite)

## commands
```
/userinfo publicid:
/skipsegments videoid: categories:
/showoff publicid:
/segmentinfo segmentid:
/userid username: exact:
/lockcategories videoid:
```

- Other commands were not added since a local ID is required, this is for quickly retreiving general stats and checking segments.
- Stat related commands were not included  
- Anonymous lookup was not included
- All commands can have their response be ephemeral by setting the hide parameter to true

## Cloudflare Environment Variables (Handling Interactions)
`CLIENT_ID` - Client ID from bot portal  
`CLIENT_PUBLIC_KEY` - Public Key from bot portal

## Local Environment Variables (Populating slash commands & options)
`CLIENT_ID` - Client ID from bot portal
`BOT_TOKEN` - Bot Token from bot portal
`CLIENT_PUBLIC_KEY` - Public key from bot portal

# Credit
API follows [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) Documentation at [ajayyy/Sponsorblock](https://github.com/ajayyy/SponsorBlock/wiki/API-Docs)

/src/util/sbc-util.js from [MRuy/sponsorBlockControl](https://github.com/MRuy/sponsorBlockControl/blob/master/src/utils.js)

Logo from [ajayyy/SponsorBlock](https://github.com/ajayyy/SponsorBlock/tree/master/public/icons), created by [@munadikieh](https://github.com/munadikieh)

Formatting and Links from [Lartza/SBTools](https://github.com/Lartza/SBtools)
