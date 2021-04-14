# Install

```
git clone https://github.com/aaronchen/lutkar.git
cd lutkar
npm install
```

# Automation: Lutkar (Puppeteer Plugin)

Lutkar is based on `puppeteer`, and uses  `puppeteer-extra` and `puppeteer-extra-plugin` to enhance its automation features.

It overrides [Page](https://pptr.dev/#?product=Puppeteer&version=main&show=api-class-page) and [Frame](https://pptr.dev/#?product=Puppeteer&version=main&show=api-class-frame) objects to add additional methods, bring in __implicit wait__, and minimizes the need to use __explicit wait__.

It also overrides [ElementHandle](https://pptr.dev/#?product=Puppeteer&version=main&show=api-class-elementhandle) to add more Element methods.

# Test Framework: Mocha.js

`mocha` and `chai` are the libraries used to manage test suites/cases, and `mochawesome` for test reports.

# Structure

- `helpers/`:
  - `helpers/chromium.js`: __Chromium__ browser with __Lutkar__ plugin
  - `helpers/mocha.js`: __Mocha Hook__ and __global variables__ for test suites
  - `helpers/Utils.js`: Utilities
  - `helpers/YML.js`: Read __YAML__
- `pages/`: Page objects
- `plugins/`:
  - [lutkar.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar.js): __Lutkar__ plugin (__puppeteer-extra-plugin__)
  - `lutkar/`
    - [LutkarBrowser.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarBrowser.js): Extend `Browser` functionality
    - [LutkarElement.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarElement.js): Extend `ElementHandle` functionality
    - [LutkarFrame.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarFrame.js): Extend `Frame` functionality
    - [LutkarHelper.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarHelper.js): Helper
    - [LutkarPage.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarPage.js): Extend `Page` functionality
    - [LutkarPageFrame.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarPageFrame.js): Extend common `Page` and `Frame` functionality
    - [LutkarTarget.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/LutkarTarget.js): Extend `Target` functionality
    - [Storage.js](https://github.com/aaronchen/lutkar/blob/main/plugins/lutkar/Storage.js): Add `localStorage` and `sessionStorage` methods to `Page`
- `test/`: Test suites (*.spec.js)
- `.mocharc.yml`: `mocha` configuration

# Test Suite

`.mocharc.yml` and `helpers/mocha.js` are configured for easy test suite creation.

```javascript
// Create the following test suite in test/google.spec.js,
// and execute `npm test` to run automation test and generate the report.
describe('Google', function () {
  it('can search puppeteer and mark its page navigation', async function () {
    await page.goto('https://www.google.com')
    await page.type('[name="q"]', 'puppeteer')
    await page.keyboard.press('Enter')

    await page.scrollIntoView('#footcnt')
    await page.drawRectangle('[role="navigation"] table')
    await page.screenshot('./screens/google.png')
  })
})
```

# Test Case

```javascript
// sample.js:  Just use chromium.js for automation.
// To run: `node sample.js`
import chromium from './helpers/chromium.js'

const browser = await chromium()
const page = await browser.newPage()

await page.goto('https://www.google.com')
await page.type('[name="q"]', 'puppeteer')
await page.keyboard.press('Enter')
// Navigating to a new page (No explicit wait required)

await page.click('[role="navigation"] .fl:eq(3)') // Go to page 5 of navigation
// Navigating to a new page (No explicit wait required)

const navigation = await page.$('[role="navigation"] table')
await navigation.scrollIntoView()
await navigation.drawRectangle()
await page.screenshot('./screens/google.png') // Screenshot of page 5 navigation

await browser.close()
```




