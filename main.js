import { format, getWeekOfMonth } from 'date-fns';
import { load } from 'js-yaml'
import { readFileSync } from 'fs';
import LemmyBot from 'lemmy-bot';
import sqlite3 from 'sqlite3';
import chalk from 'chalk';
import 'dotenv/config';
import { start } from 'repl';

let { markAsBot, timeCheckInterval, responseMessage, invalidMessage, showLogs, overflowMessage, finalMessage, allowKeywords } = load(readFileSync('config.yaml', 'utf8'));

markAsBot = markAsBot ?? true;
showLogs = showLogs ?? false;
allowKeywords = allowKeywords ?? false; // DO NOT ENABLE

log(`${chalk.magenta('STARTED:')} Started Bot`)

function log(message) {
    if (showLogs) {
        console.log(message);
    }
}

// -----------------------------------------------------------------------------
// Databases

const db = new sqlite3.Database('remindme.sqlite3', (err) => {
    if (err) {
        return console.error(err.message);
    }
    log(`${chalk.green('DB:')} Connected to the database.`);

    db.run(`CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id TEXT NOT NULL,
        parent_id TEXT NOT NULL,
        start_timestamp DATETIME NOT NULL,
        end_timestamp DATETIME NOT NULL
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        log(`${chalk.grey('TABLE:')} Loaded reminders table.`);
    });
});

// -----------------------------------------------------------------------------
// Main Bot Code

let handlers = {}

handlers["mention"] = async ({
    mentionView: { comment },
    botActions: { createComment },
}) => {
    const words = comment.content.split(' ');
    let amount = 0;

    for (let i = 1; i < words.length; i++) {
        const word = words[i];

        if (word === 'seconds' || word === 'second') {
            const seconds = parseInt(words[i - 1]);
            if (seconds) amount += seconds;
        }
        else if (word === 'minutes' || word === 'minute') {
            const seconds = parseInt(words[i - 1])*60;
            if (seconds) amount += seconds;
        }
        else if (word === 'hours' || word === 'hour') {
            const seconds = parseInt(words[i - 1])*60*60;
            if (seconds) amount += seconds;
        }
        else if (word === 'days' || word === 'day') {
            const seconds = parseInt(words[i - 1])*60*60*24;
            if (seconds) amount += seconds;
        }
        else if (word === 'weeks' || word === 'week') {
            const seconds = parseInt(words[i - 1])*60*60*24*7;
            if (seconds) amount += seconds;
        }
        else if (word === 'months' || word === 'month') {
            const seconds = parseInt(words[i - 1])*60*60*24*7*4;
            if (seconds) amount += seconds;
        }
        else if (word === 'years' || word === 'year') {
            const seconds = parseInt(words[i - 1])*60*60*24*7*4*12;
            if (seconds) amount += seconds;
        }
    }

    if (amount > 0) {
        // Stop larger than 10 years
        if (amount > 315360000) {
            createComment({ content: overflowMessage, parent_id: comment.id, post_id: comment.post_id });
            return;
        }

        addReminder(amount, comment.ap_id, createComment, comment);
    }
    else {
        createComment({ content: invalidMessage, parent_id: comment.id, post_id: comment.post_id });
    }
}

if (allowKeywords) {
    handlers["comment"] = {
        sort: 'New',
        secondsBetweenPolls: 3,
        handle: async ({
            commentView: {
                comment,
            },
            botActions: { createComment },
        }) => {
            const words = comment.content.split(' ');
            let amount = 0;

            if (words.length < 1) return;
            if (words[0].toLowerCase() !== '!remindme' && words[0].toLowerCase() !== '@remindme') return;

            for (let i = 1; i < words.length; i++) {
                const word = words[i];

                if (word.includes('second')) {
                    const seconds = parseInt(words[i - 1]);
                    if (seconds) amount += seconds;
                }
                else if (word.includes('minute')) {
                    const seconds = parseInt(words[i - 1])*60;
                    if (seconds) amount += seconds;
                }
                else if (word.includes('hour')) {
                    const seconds = parseInt(words[i - 1])*60*60;
                    if (seconds) amount += seconds;
                }
                else if (word.includes('day')) {
                    const seconds = parseInt(words[i - 1])*60*60*24;
                    if (seconds) amount += seconds;
                }
                else if (word.includes('week')) {
                    const seconds = parseInt(words[i - 1])*60*60*24*7;
                    if (seconds) amount += seconds;
                }
                else if (word.includes('month')) {
                    const seconds = parseInt(words[i - 1])*60*60*24*7*4;
                    if (seconds) amount += seconds;
                }
                else if (word.includes('year')) {
                    const seconds = parseInt(words[i - 1])*60*60*24*7*4*12;
                    if (seconds) amount += seconds;
                }
            }

            if (amount > 0) {
                // Stop larger than 10 years
                if (amount > 315360000) {
                    createComment({ content: overflowMessage, parent_id: comment.id, post_id: comment.post_id });
                    return;
                }

                addReminder(amount, comment.ap_id, createComment, comment);
            }
            else {
                createComment({ content: invalidMessage, parent_id: comment.id, post_id: comment.post_id });
            }
        }
    }
}


const bot = new LemmyBot.LemmyBot({
    instance: process.env.LEMMY_INSTANCE,
    credentials: {
        username: process.env.LEMMY_USERNAME,
        password: process.env.LEMMY_PASSWORD,
    },
    dbFile: 'db.sqlite3',
    federation: 'all',
    markAsBot: markAsBot,
    handlers: handlers,
    schedule: [
        {
            cronExpression: `0 */${timeCheckInterval} * * * *`,
            timezone: 'America/Toronto',
            doTask: async ({createComment}) => {
                db.all(`SELECT * FROM reminders WHERE end_timestamp <= ?`, [new Date(Date.now())], (err, rows) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    log(`${chalk.grey('DB:')} Found ${rows.length} reminders to post.`);

                    for (const row of rows) {
                        createComment({ content: finalMessage, parent_id: parseInt(row.parent_id), post_id: parseInt(row.post_id) });
                    }

                    db.run(`DELETE FROM reminders WHERE end_timestamp <= ?`, [new Date(Date.now())], (err) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        log(`${chalk.grey('DB:')} Removed reminders from database.`);
                    });
                });
            }
        }
    ]
});

function addReminder (seconds, link, createComment, comment) {
    const startTimestamp = new Date(Date.now());
    const timestamp = new Date(Date.now() + seconds * 1000);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    };

    db.run(`INSERT INTO reminders (start_timestamp, end_timestamp, post_id, parent_id) VALUES (?, ?, ?, ?)`, [startTimestamp, timestamp, comment.post_id, comment.id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        log(`${chalk.grey('DB:')} Added reminder to database.`);
    });

    createComment({ content: responseMessage.replace("${TIME}", timestamp.toLocaleString("en-US", options)), parent_id: comment.id, post_id: comment.post_id });
}

bot.start();