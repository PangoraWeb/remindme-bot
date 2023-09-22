/**
 * @file Logs text to the console properly based on passed in values
 */

import chalk from 'chalk'
import { showLogs } from './config.js'

export const LogCategory = {
  PRIMARY: 0,
  SECONDARY: 1,
  SUCCESS: 2,
  WARNING: 3,
  DANGER: 4,
  INFO: 5,
}

export function log(header, message, category) {
  if (showLogs) {
    console.log(`${applyLogCategoryColor(header, category)}: ${message}`)
  }
}

function applyLogCategoryColor(text, category) {
  switch (category) {
    case LogCategory.PRIMARY:
      return chalk.blue(text)
    case LogCategory.SECONDARY:
      return chalk.gray(text)
    case LogCategory.SUCCESS:
      return chalk.green(text)
    case LogCategory.WARNING:
      return chalk.yellow(text)
    case LogCategory.DANGER:
      return chalk.red(text)
    case LogCategory.INFO:
      return chalk.cyan(text)
  }
}
