/**
 * @file Reads in the config values set in config.yaml and provides them for
 * the rest of the code to use
 */

import { load } from 'js-yaml'
import { readFileSync } from 'fs'

export const {
  timeCheckInterval,
  responseMessage,
  invalidMessage,
  showLogs,
  overflowMessage,
  finalMessage,
} = (() => {
  let config = load(readFileSync('config.yaml', 'utf8'))

  config.showLogs = config.showLogs ?? false

  return config
})()
