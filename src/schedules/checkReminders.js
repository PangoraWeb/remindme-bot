import { finalMessage, timeCheckInterval } from '../common/config.js'
import db from '../common/database.js'
import { LogCategory, log } from '../common/log.js'

export default {
  cronExpression: `0 */${timeCheckInterval} * * * *`,
  timezone: 'America/Toronto',
  doTask: async ({ createComment }) => {
    db.all(
      `SELECT * FROM reminders WHERE end_timestamp <= ?`,
      [new Date(Date.now())],
      (err, rows) => {
        if (err) {
          return console.error(err.message)
        }

        log('DB', `Found ${rows.length} reminders to post.`, LogCategory.INFO)

        for (const row of rows) {
          createComment({
            content: finalMessage,
            parent_id: parseInt(row.parent_id),
            post_id: parseInt(row.post_id),
          })
        }

        db.run(
          `DELETE FROM reminders WHERE end_timestamp <= ?`,
          [new Date(Date.now())],
          (err) => {
            if (err) {
              return console.error(err.message)
            }

            log('DB', 'Removed reminders from database.', LogCategory.SUCCESS)
          }
        )
      }
    )
  },
}
