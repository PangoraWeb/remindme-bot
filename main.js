import LemmyBot from 'lemmy-bot'
import { LogCategory, log } from './src/common/log.js'
import 'dotenv/config'
import * as path from 'path'
import { readdirSync } from 'fs'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

log('LOADING', 'Loading Bot', LogCategory.SUCCESS)

// -----------------------------------------------------------------------------
// Load Handlers

const handlers = {}
const handlersPath = path.join(__dirname, 'src/handlers')
const handlerFiles = readdirSync(handlersPath).filter((file) =>
  file.endsWith('.js')
)

for (const file of handlerFiles) {
  const filePath = path.join(handlersPath, file)
  const { default: command } = await import('file://' + filePath)

  handlers[file.split('.').shift()] = command
}

log(
  'LOADED',
  `Loaded ${handlerFiles.length} handlers${
    handlerFiles.length != 1 ? 's' : ''
  }`,
  LogCategory.SUCCESS
)

// -----------------------------------------------------------------------------
// Load Schedules

const schedules = []
const schedulesPath = path.join(__dirname, 'src/schedules')
const scheduleFiles = readdirSync(schedulesPath).filter((file) =>
  file.endsWith('.js')
)

for (const file of scheduleFiles) {
  const filePath = path.join(schedulesPath, file)
  const { default: command } = await import('file://' + filePath)

  schedules.push(command)
}

log(
  'LOADED',
  `Loaded ${scheduleFiles.length} schedule${
    scheduleFiles.length != 1 ? 's' : ''
  }`,
  LogCategory.SUCCESS
)

// -----------------------------------------------------------------------------
// Main Bot Code

if (
  process.env.LEMMY_INSTANCE &&
  process.env.LEMMY_USERNAME &&
  process.env.LEMMY_PASSWORD
) {
  const bot = new LemmyBot.LemmyBot({
    instance: process.env.LEMMY_INSTANCE,
    credentials: {
      username: process.env.LEMMY_USERNAME,
      password: process.env.LEMMY_PASSWORD,
    },
    dbFile: 'db.sqlite3',
    federation: {
      allowList: ['programming.dev'],
    },
    markAsBot: true,
    handlers: handlers,
    schedule: schedules,
  })

  bot.start()
  log('STARTED', 'Started Bot', LogCategory.SUCCESS)
} else {
  log(
    'COULD NOT START',
    'Your environment file is missing or not formatted correctly.',
    LogCategory.DANGER
  )
}
