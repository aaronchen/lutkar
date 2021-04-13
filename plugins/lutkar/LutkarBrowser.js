import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarBrowser: Browser Methods #####
 */

class LutkarBrowser {
  async pages() {
    const pages = await this.__pages()
    return LutkarHelper.lutkarifyPages(pages)
  }
}

export default LutkarBrowser
