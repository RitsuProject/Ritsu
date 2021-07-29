<p align="center">
<img width=250px src="https://i.imgur.com/d56z25o.png">
</p>
<h1 align="center">
Ritsu
</h1>
   
<p align="center"><b>A Discord Bot based on the AnimeMusicQuiz (AMQ) game, <br>play using your MAL/Anilist animelist and with different game modes! ✨</b></p>

<p align="center">
<a title="Crowdin" target="_blank" href="https://crowdin.com/project/ritsu"><img src="https://badges.crowdin.net/ritsu/localized.svg"></a>
<a href="https://discord.gg/XuDysZg"><img src="https://discordapp.com/api/guilds/764929033723969567/widget.png"></a>
<br>
</p>

# Ritsu Shutdown

Ritsu was shut down on 07/29/2021.
Read why here: https://rentry.co/u6i8a

Feel free to do whatever you want with this code, whether it's hosting your private or even an public instance.
The only rule is to follow the MIT license and leave the original source code credits.

---

## About

Ritsu is a Discord Bot based on the game of guessing animes by openings/endings themes, mostly known as AnimeMusicQuiz. Her goal is to bring the AMQ magic fully to the Discord.
<br>
<br>
We are <b>totally open-source</b> and contribuitions are more than welcome, feel free to get around with the code and see how everything works. If you want do contribuite to the codebase, continue reading and will know how. 


## Want to add her? 

<img src="https://i.imgur.com/USCFUYx.png" width=250px align="right">

Don't you want to know about codes or complicated blah blah blah and just want to play and have fun? You can add the incredible public version just [clicking here](https://ritsu.fun/invite)  (｡･∀･)ﾉﾞ

Having problems, do you want to make a suggestion or talk to us? Feel free to join our support server!
<br>
<br>
<a href="https://discord.gg/XuDysZg">
<img src="https://invidget.switchblade.xyz/XuDysZg">
</a>

## Contributing or Self-Hosting.

Do you want to contribute to the Ritsu source code? Add new features or even fix a bug?

### Writing code

Want to add new things to Ritsu? First, know that Ritsu is extremely simple, the bot ecosystem doesn't have much of a secret (at least, I hope), so once you open it you should understand how everything works. If you have an idea, please open an issue first and describe it, so we can stay tuned.

### Translate Ritsu!

Is it not available in your language? You can easily translate it using Crowdin, enter the project and mention me (sazz) on the support server, so you will win a fancy translator role and access to the translator channels.

https://crowdin.com/project/ritsu

### Self-Hosting

**We do not recommend you to self-host the bot yourself, unless it is to contribute to the code, but if you still want to, study the bot ecosystem and be on your own, it is not difficult, we will not give support you if not to contribute to the code or learn something from Ritsu.**

- Fork the project and clone to your computer.

#### .env Structure

```ascii
.env
└── DISCORD_TOKEN
    ├── Your Discord Bot Token
└── RITSU_PREFIX
    ├── Default Prefix to all the servers
└── MONGODB_URI
    ├── The URL of your MongoDB database that Ritsu will use.
└── RITSU_ENVIRONMENT
    ├── Your bot's environment, use canary for the development version or production for the production version.
└── BOTLIST_AUTH
    ├── discordbotlist.com API Token (You don't need to put anything here if the environment is canary.)
└── DBL_AUTH=
    ├── top.gg API Token (You don't need to put anything here if the environment is canary.)
└── API_URL=
    ├── Ritsu API URL (https://github.com/RitsuProject/Mio)
```

(Remember, this is just what you need to make Ritsu work, maybe it has more values ​​than if empty, some things may not work properly...)

#### Starting Ritsu

```
yarn dev (for development purposes)
yarn start (for production purpose)
```

### Branch's

- `master` - Current code running on production, never deploy code here before testing and reviewing.
- `v3` - Ritsu's newest version, totally rewritten in TypeScript and Eris (beta stage)
- `v2` - Archive of the V2 code which is written fully in JavaScript and discordjs.

---

## Credits

If it weren't for them, maybe Ritsu wouldn't even exist (or development would be much more complicated).

> https://animethemes.moe -> First source of openings/endings themes. Basically the god of the gods.

> https://openings.moe -> Secondary source of openings/endings themes. Helping Ritsu on the most hardest moments.

> https://animemusicquiz.com ->The biggest inspiration for this project.

> https://github.com/LeNitrous/kyuu-chan-hackweek -> Ritsu's V1 was based on his code, nothing more fair than leaving the credits.
