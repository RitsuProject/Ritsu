<p align="center">
<img src="https://ritsu.sazz.fail/assets/ritsu-logo.svg" width="50%">
</p>

<h1 align="center">Ritsu</h1>

<p align="center">🎶 A bot on Discord based on the game of guessing the anime by its Ending or Opening theme!</p>

<p align="center">
<a title="Crowdin" target="_blank" href="https://crowdin.com/project/ritsu"><img src="https://badges.crowdin.net/ritsu/localized.svg"></a>
<img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
<br>
<a href="https://top.gg/bot/763934732420382751">
<img src="https://top.gg/api/widget/763934732420382751.svg" alt="Ritsu" />
</a>
</p>

## Add the Bot

Invite: https://sazz.fail/ritsu
<br>
Support Server: https://discord.gg/XuDysZg

## How to Play

When using the command to start `(ritsu!start)` the game, the bot will play a song from a random opening or ending (or if you specify the year of the themes in the start command) and whoever can guess the anime from the largest number of openings or endings according to the rounds , wins.

Check the `ritsu!help` for more information

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

#### Starting Ritsu

```
yarn (or npm install, but we uses yarn)
node index.js (or node .)
```

### Branch's

- `Canary` - Work here, it is the branch we use for development and it is tested at Ritsu Canary.
- `Master` - It is **just** to release the final code to Ritsu, all that is in it is what is currently running in production.
- `Crowdin-Locales` - Used by Crowdin to put the current translations, we always give a PR to the canary frequently, thus keeping the locales up to date.

## Credits

If it weren't for them, maybe Ritsu wouldn't even exist (or development would be much more complicated).

> https://github.com/LeNitrous/kyuu-chan-hackweek -> Many parts of the code I was inspired by it.

<br>

> https://animethemes.moe -> For providing the themes for the bot to play.

<br>

> https://openings.moe -> For providing the themes for the bot to play.

<br>

> https://animemusicquiz.com -> Of course, the biggest inspiration for this project was the Anime Music Quiz.
