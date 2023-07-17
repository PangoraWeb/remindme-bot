# Lemmy-RemindMe-Bot
A lemmy bot that reminds you after an amount of time

This bot is being hosted already at programming.dev! You dont need to self host unless you want to change it or your instance has been defederated (which should be extremely rare)
To trigger the bot just mention it at the start of the message. `Ex: @RemindMe@programming.dev remind me in 5 minutes`

## Setup
1. Clone the repository
2. Create an account in the instance you want the bot to have as its home (just make a regular user)
3. Create a file called .env in the bot folder and give it values in this format with the data in the quotes (dont add the slashes or the part after the slashes)
```
LEMMY_INSTANCE="" // The instance the bot account is in
LEMMY_USERNAME="" // The bot username
LEMMY_PASSWORD="" // The bot password
```
4. Change the data in config.yaml based on what you want set
5. Open a terminal in the bot folder and run `npm install` to install dependendies and then `node main.js` to run the bot (whenever you want to start the bot again you can just do ctrl+c to interrupt the process and node main.js to start the bot)

I recommend installing something like [forever.js](https://www.npmjs.com/package/forever) for making it run continually

If you run into issues feel free to dm me on Matrix [here](https://matrix.to/#/@ategon:matrix.org)
