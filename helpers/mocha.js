// Global variables for mocha.js
import { assert, expect } from 'chai'
import addContext from 'mochawesome/addContext.js'
import chromium from './chromium.js'
import Utils from './Utils.js'
import YML from './YML.js'

global.chromium = chromium
global.Utils = Utils
global.YML = YML
global.addContext = addContext
global.assert = assert
global.expect = expect

// Global variables for puppeteer/lutkar
global.browser = {}
global.page = {}

// Hooks for mocha.js
export const mochaHooks = {
  beforeAll: [
    async function () {
      browser = await chromium()
      page = await browser.newPage()
    }
  ],

  beforeEach: [
    async function () {
      await page.bringToFront()
    }
  ],

  afterEach: [
    async function () {
      if (this.currentTest.state === 'failed') {
        let title = this.currentTest.title
        let parent = this.currentTest.parent

        while (parent && parent.title) {
          title = `${parent.title} - ${title}`
          parent = parent.parent
        }

        const pages = await browser.pages()

        for (const p of pages) {
          if (await p.isPageVisible()) await p.screenshot(`./screens/${title}.png`, { fullPage: true })
        }
      }
    }
  ],

  afterAll: [
    async function () {
      await browser.close()
    }
  ]
}
