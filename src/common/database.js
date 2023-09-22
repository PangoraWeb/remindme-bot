/**
 * @file Creates and provides a database to store persistent data for the bot
 */

import { LogCategory, log } from './log.js'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('remindme.sqlite3', (err) => {
  if (err) {
    return console.error(err.message)
  }
  log('DB', 'Connected to the database.', LogCategory.SUCCESS)

  db.run(
    `CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id TEXT NOT NULL,
        parent_id TEXT NOT NULL,
        start_timestamp DATETIME NOT NULL,
        end_timestamp DATETIME NOT NULL
    )`,
    (err) => {
      if (err) {
        return console.error(err.message)
      }
      log('TABLE', 'Loaded reminders table.', LogCategory.SUCCESS)
    }
  )
})

export default db
