import fs from 'fs'
import YAML from 'yaml'

class YML {
  constructor(filepath, encoding = 'utf8') {
    const file = fs.readFileSync(filepath, encoding)
    this._yml = YAML.parse(file)
  }

  /**
   * @param {String} notation Dot notation
   * @returns {any} Any supported YAML data types
   */
  t(notation) {
    return notation.split('.').reduce((obj, key) => obj[key], this._yml)
  }
}

export default YML
