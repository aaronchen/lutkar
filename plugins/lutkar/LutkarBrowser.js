import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarBrowser: Browser Methods #####
 */

class LutkarBrowser {
  async pages() {
    const pages = await this.__pages()
    return LutkarHelper.lutkarifyPages(pages)
  }

  // target() {
  //   const target = this.__target()
  //   return LutkarHelper.lutkarifyTarget(target)
  // }

  // targets() {
  //   const targets = this.__targets()
  //   return LutkarHelper.lutkarifyTargets(targets)
  // }
}

export default LutkarBrowser
