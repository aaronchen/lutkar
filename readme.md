# Install

```
cd lutkar
npm install
```

# Automation: Lutkar (Puppeteer Plugin)

Lutkar is based on `puppeteer`, and uses  `puppeteer-extra` and `puppeteer-extra-plugin` to enhance its automation features.

It also bring in _implicit wait_ to `puppeteer` to minimize the use of explicit wait.  

# Test Framework: Mocha.js

`mocha` and `chai` are the libraries used to manage test suites/cases, and `mochawesome` for test reports.

# Structure

- `helpers/`: Chromium (Puppeteer/Chromium), Mocha (mocha.js), Utilities, etc
- `plugins/`: lutkar (Puppeteer plugin)
- `pages/`: Page Objects
- `test/`: Test suites (*.spec.js)

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




