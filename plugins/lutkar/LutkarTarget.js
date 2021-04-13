import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarTarget: Browser Methods #####
 */

class LutkarTarget {
  async page() {
    const page = await this.__page()
    return LutkarHelper.lutkarifyPage(page)
  }
}

export default LutkarTarget
