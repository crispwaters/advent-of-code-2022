const LOG_LEVELS = {
  verbose: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  timer: 60,
  none: Infinity
}
class Logger {
  static LOG_LEVELS = Object.freeze(LOG_LEVELS)
  static LOG_LEVEL = LOG_LEVELS.info
  static log(...msg) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.debug) console.log(...msg)
  }
  static debug(...msg) {
    Logger.log(...msg)
  }
  static verbose(...msg) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.verbose) console.log(...msg)
  }
  static info(...msg) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.info) console.log(...msg)
  }
  static warn(...msg) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.warn) console.log(...msg)
  }
  static error(...msg) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.error) console.log(...msg)
  }
  static time(label) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.timer) console.time(label)
  }
  static timeLog(label) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.timer) console.timeLog(label)
  }
  static timeEnd(label) {
    if (Logger.LOG_LEVEL <= LOG_LEVELS.timer) console.timeEnd(label)
  }
}

module.exports = Logger