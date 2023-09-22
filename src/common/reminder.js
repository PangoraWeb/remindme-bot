/**
 * @file Handles reminder creation when someone wants one to be made
 */

import db from './database.js'
import { LogCategory, log } from './log.js'
import { responseMessage } from './config.js'

export function addReminder(seconds, createComment, comment) {
  const startTimestamp = new Date(Date.now())
  const timestamp = new Date(Date.now() + seconds * 1000)

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }

  db.run(
    `INSERT INTO reminders (start_timestamp, end_timestamp, post_id, parent_id) VALUES (?, ?, ?, ?)`,
    [startTimestamp, timestamp, comment.post_id, comment.id],
    (err) => {
      if (err) {
        return console.error(err.message)
      }
      log(
        'DB',
        `Added reminder for message (${comment.content}) to database.`,
        LogCategory.SUCCESS
      )
    }
  )

  createComment({
    content: responseMessage.replace(
      '${TIME}',
      timestamp.toLocaleString('en-US', options)
    ),
    parent_id: comment.id,
    post_id: comment.post_id,
  })
}
