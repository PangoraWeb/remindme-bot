<div align="center">
  
![GitHub tag (latest SemVer)](https://img.shields.io/github/release/PangoraWeb/remindme-bot.svg?style=for-the-badge)
[![GitHub issues](https://img.shields.io/github/issues-raw/PangoraWeb/remindme-bot.svg?style=for-the-badge)](https://github.com/PippitWeb/pippit/issues)
[![License](https://img.shields.io/github/license/PangoraWeb/remindme-bot.svg?style=for-the-badge)](LICENSE)
![GitHub stars](https://img.shields.io/github/stars/PangoraWeb/remindme-bot.svg?style=for-the-badge)

</div>
<div align="center">
  <img src="https://github.com/PangoraWeb/remindme-bot/assets/73616169/7b5a8297-7c60-4bb7-b09d-63feaa72803a" width=200px height=200px></img>
  <h3 align="center"><a href="">RemindMe Bot</a></h3>
  <p align="center">
    A reminder bot for Pangora, Lemmy, and Kbin to remind yourself after a period of time.
  </p>
</div>

## About the Bot
The remindme bot responds to you after a period of time to remind you about something (e.g. if someone in a post says theyre going to do something after a week and you want to be there for that)

Theres a version of this bot being hosted currently in programming.dev. You can still self host your own if you want to do things like customize it a bit more for your community but its not required. All remindme bots can work simultaneously since its triggered off of mentions as opposed to a command.

## Usage
To use the bot you need to mention it and put a length of time somewhere in the message.

`Example: @RemindMe@programming.dev 5 years`

`Example: @RemindMe@programming.dev remind me about this in 2 minutes`

In order to function in your community you need to request that it be added to the whitelist in the issues tab in this repository (only mods + admins of the community can request)

## Self-Hosting Setup
You need node.js downloaded to run this

1. Clone the repository (`git clone https://github.com/PangoraWeb/remindme-bot.git` in a terminal)
2. Create an account in the instance you want the bot to have as its home (just make a regular user)
3. Create a file called .env in the bot folder and give it values in this format with the data in the quotes (dont add the slashes or the part after the slashes)
```
LEMMY_INSTANCE="" // The instance the bot account is in
LEMMY_USERNAME="" // The bot username
LEMMY_PASSWORD="" // The bot password
```
4. Change the data in config.yaml based on what you want set
5. Open a terminal in the bot folder and run `npm install` to install dependendies and then `node main.js` to run the bot (whenever you want to start the bot again you can just do ctrl+c to interrupt the process and node main.js to start the bot)

I recommend installing something like [forever.js](https://www.npmjs.com/package/forever) for running it in the background on your server

If you run into issues feel free to dm me on Matrix [here](https://matrix.to/#/@ategon:matrix.org)

## Contributing
If you want to contribute to add some sort of feature feel free to make a pull request with it added

[This repository](https://github.com/firstcontributions/first-contributions) has some info on how to do development in a repository and make a pull request

## Credits
Icon base by [Delapouite](https://delapouite.com/) under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) with modifications to add a gradient
