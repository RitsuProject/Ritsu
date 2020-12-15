<p align="center">
<img src="https://ritsu.sazz.fail/assets/ritsu-logo.svg" width="50%">
<p>
   
<p align="center">🎶 A bot on Discord based on the game of guessing the anime by its Ending or Opening theme!</p>

<p align="center">
<a title="Crowdin" target="_blank" href="https://crowdin.com/project/ritsu"><img src="https://badges.crowdin.net/ritsu/localized.svg"></a>
<img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
<a href="https://discord.gg/XuDysZg"><img src="https://discordapp.com/api/guilds/764929033723969567/widget.png"></a>
<a href="https://ritsu.sazz.fail"><img alt="website" src="https://img.shields.io/badge/website-Ritsu-ff3860"></a>
<img alt="code quality" src="https://www.code-inspector.com/project/16601/status/svg"></a>
<br>
<a href="https://top.gg/bot/763934732420382751">
<img src="https://top.gg/api/widget/763934732420382751.svg" alt="Ritsu" />
</a>
</p>

Ritsu is a bot on Discord based on the game AnimeMusicQuiz, guessing anime by its opening / ending music! Cool huh? And even better, it is completely open-source.

Our goal here in this repository is learning and contributing! We want more people to learn how Ritsu works and maybe in the future even contribute with bug fixes and new features! So, feel free to play around with the code, did you find something that is not documented, wrong or poorly explained? We'd love to know! Open a pull request with the correction or addition and we will receive it.

## Public Version <img src="https://ritsu.sazz.fail/assets/ritsu_header.png" width="450px" align="right">

Don't you want to know about codes or complicated blah blah blah and just want to play and have fun? You can add the incredible public version (｡･∀･)ﾉﾞ

Invite: https://sazz.fail/ritsu/invite
<br>

Having problems, do you want to make a suggestion or talk to us? Feel free to join our support server!
<br>
https://discord.gg/XuDysZg

## Contributing or Self-Hosting.

Do you want to contribute to the Ritsu source code? Add new features or even fix a bug?

### Bugs

Did you find a bug? Feel free to open an issue and describe the bug (try to give as much information as possible), if you have any questions, enter the support server above and feel free to ask!

### Writing code

Want to add new things to Ritsu? First, know that Ritsu is extremely simple, the bot ecosystem doesn't have much of a secret, so once you open it you should understand how everything works (just to be clear, Ritsu is made in Javascript). If you have an idea, please open an issue first and describe it, so we can stay tuned. Don't have an idea? We are always adding new things to do in the Issue, comment saying that you will do it and now it's just fork, clone on your computer and when you're done open a pull request!

### Discussion and Planning

Want to discuss an idea? Join to the support server and feel free to say your opinion! We always create a small project on github with issues that should go to the next update, feel free to take a look [here](https://github.com/orgs/RitsuProject/projects) too!

### Translate Ritsu!

Is it not available in your language? You can easily translate it using Crowdin, enter the project and mention me (sazz # 0002) on the support server, so you will win a fancy translator role.

https://crowdin.com/project/ritsu

### Self-Hosting

**We do not recommend you to self-host the bot yourself, unless it is to contribute to the code, but if you still want to, study the bot ecosystem and be on your own, it is not difficult, we will not give support you if not to contribute to the code or learn something from Ritsu.**

- Fork the project and clone to your computer.

#### .env Structure

```ascii
.env
└── TOKEN
    ├── Your Bot Discord Token
└── BOT_PREFIX
    ├── Default Prefix to all the servers
└── MONGOURI
    ├── The URL of your MongoDB database that Ritsu will use.
└── VERSION
    ├── Your bot's environment, use canary for the development version or production for the production version.
└── BOTLIST_TOKEN
    ├── discordbotlist.com API Token (You don't need to put anything here if the environment is canary.)
└── DBL_TOKEN
    ├── top.gg API Token (You don't need to put anything here if the environment is canary.)
└── API URL
    ├── Ritsu API URL (https://github.com/RitsuProject/Mio)
```

(Remember, this is just what you need to make Ritsu work, maybe it has more values ​​than if empty, some things may not work properly...)

#### Starting Ritsu

```
yarn (or npm install, but we uses yarn)
node index.js (or node .)
```

### Branch's

- `Canary` - Work here, it is the branch we use for development and it is tested at Ritsu Canary.
- `Master` - It is **just** to release the final code to Ritsu, all that is in it is what is currently running in production.
- `Crowdin-Locales` - Used by Crowdin to put the current translations, we always give a PR to the canary frequently, thus keeping the locales up to date.

---

## Credits

If it weren't for them, maybe Ritsu wouldn't even exist (or development would be much more complicated).

> https://github.com/LeNitrous/kyuu-chan-hackweek -> Many parts of the code I was inspired by it.

> https://animethemes.moe -> For providing the themes for the bot to play.

> https://openings.moe -> For providing the themes for the bot to play.

> https://animemusicquiz.com -> Of course, the biggest inspiration for this project was the Anime Music Quiz.
