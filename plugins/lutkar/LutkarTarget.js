import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarTarget: Browser Methods #####
 */

class LutkarTarget {
  // browser() {
  //   const browser = this.__browser()
  //   return LutkarHelper.lutkarifyBrowser(browser)
  // }

  async page() {
    const page = await this.__page()
    return LutkarHelper.lutkarifyPage(page)
  }
}

export default LutkarTarget
