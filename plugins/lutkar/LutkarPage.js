import Utils from '../../helpers/Utils.js'
import LutkarPageFrame from './LutkarPageFrame.js'
import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarPage: Page-only Methods #####
 */

class LutkarPage extends LutkarPageFrame {
  async $frame(selector, waitOptions = {}) {
    const frameElement = await this.wait(selector, waitOptions)

    let frame = await frameElement.contentFrame()

    LutkarHelper.lutkarifyFrame(frame)

    await frame.waitForFunction(() => document.readyState == 'complete')

    return frame
  }

  async acceptAlert() {
    const page = this

    const promise = new Promise((resolve) => {
      return page.once('dialog', async (dialog) => {
        return resolve(await dialog.accept())
      })
    })

    return await this.waitForPromise(promise, 'acceptAlert timed-out')
  }

  async copyToClipboard(text) {
    await this.evaluate((text) => {
      let input = document.createElement('input')
      input.value = text
      input.style.position = 'absolute'
      input.style.left = '-9999px'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }, text)
  }

  async dismissAlert() {
    const page = this

    const promise = new Promise((resolve) => {
      return page.once('dialog', async (dialog) => {
        return resolve(await dialog.dismiss())
      })
    })

    return await this.waitForPromise(promise, 'dismissAlert timed-out')
  }

  async isPageVisible() {
    return await this.evaluate(() => document.visibilityState == 'visible')
  }

  async pasteFromClipboard(cmdKey = 'Control') {
    await this.keyboard.down(cmdKey)
    await this.keyboard.type('v')
    await this.keyboard.up(cmdKey)
  }

  async screenshot(path, options = { fallPage: false }) {
    if (!/\.(png|jpg)$/i.test(path)) path += '.png'

    Utils.mkdir(path, true)

    return await this.__screenshot({ ...options, path: path })
  }

  async waitForTitleIncludes(title) {
    return this.waitForFunction((title) => document.title.includes(title), {}, title)
  }
}

export default LutkarPage
