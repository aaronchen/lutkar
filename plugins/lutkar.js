import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin'
import LutkarHelper from './lutkar/LutkarHelper.js'

/*
 * ##### Lutkar: Puppeteer Plugin #####
 */

class Lutkar extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'lutkar'
  }

  async onBrowser(browser) {
    LutkarHelper.lutkarifyBrowser(browser)
  }

  async onPageCreated(page) {
    LutkarHelper.lutkarifyPage(page)
  }

  async onTargetCreated(target) {
    LutkarHelper.lutkarifyTarget(target)
  }
}

export default function (pluginConfig) {
  return new Lutkar(pluginConfig)
}
