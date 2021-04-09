import fs from 'fs'
import _ from 'lodash'
import { DateTime } from 'luxon'
import path from 'path'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const PUNCTUATION = `!"#$%&'()*+, -./:;<=>?@[\\]^_\`{|}~`

/*
 * For DateTime Format: https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
 */

class Utils {
  static dateDelta(delta, options = { format: 'LL/dd/yyyy', timezone: 'local' }) {
    options = { format: 'LL/dd/yyyy', timezone: 'local', ...options }

    if (delta >= 0) {
      return DateTime.now().setZone(options.timezone).plus({ days: delta }).toFormat(options.format)
    } else {
      return DateTime.now().setZone(options.timezone).minus({ days: delta }).toFormat(options.format)
    }
  }

  static dirname(filepath) {
    return path.dirname(filepath)
  }

  static isPath(filepath) {
    return fs.existsSync(filepath)
  }

  static mkdir(path, isFile = false) {
    const directory = isFile ? Utils.dirname(path) : path
    if (!Utils.isPath(directory)) fs.mkdirSync(directory, { recursive: true })
  }

  static randomString(size = 10, options = { letters: true, digits: true, punctuation: false }) {
    options = { letters: true, digits: true, punctuation: false, ...options }

    let characters = ''
    let result = ''

    if (options.letters) characters += LETTERS
    if (options.digits) characters += DIGITS
    if (options.punctuation) characters += PUNCTUATION

    for (let i = 0; i < size; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return result
  }

  static readFile(filepath) {
    if (!Utils.isPath(filepath)) {
      throw new Error(`File does not exist: ${filepath}`)
    }

    return fs.readFileSync(filepath)
  }

  static readJSON(filepath) {
    const data = Utils.readFile(filepath)
    return JSON.parse(data)
  }

  static removeDir(directory) {
    fs.rmdirSync(directory, { recursive: true })
  }

  static removeFile(filepath) {
    fs.unlinkSync(filepath)
  }

  static sample(collection) {
    return _.sample(collection)
  }

  static sampleSize(collection, number) {
    return _.sampleSize(collection, number)
  }

  static stringToDateTime(dateString, format = 'LL/dd/yyyy', timezone = 'local') {
    return DateTime.fromFormat(dateString, format, { zone: timezone })
  }

  static timestamp(format = 'yyyyLLddHHmmss') {
    return DateTime.now().toFormat(format)
  }

  static today(format = 'LL/dd/yyyy', timezone = 'local') {
    return DateTime.now().setZone(timezone).toFormat(format)
  }
}

export default Utils
