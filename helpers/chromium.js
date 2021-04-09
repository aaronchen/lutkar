import dotenv from 'dotenv'
import puppeteer from 'puppeteer-extra'
import userPreferencesPlugin from 'puppeteer-extra-plugin-user-preferences'
import lutkar from '../plugins/lutkar.js'

dotenv.config({ silent: true })

const profile = {
  args: [
    '--allow-insecure-localhost',
    '--allow-running-insecure-content',
    '--disable-features=IsolateOrigins,site-per-process',
    '--no-default-browser-check'
  ],
  defaultViewport: null,
  ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=IdleDetection'],
  ignoreHTTPSErrors: true
}

const preferences = function (languages = 'en') {
  return userPreferencesPlugin({
    userPrefs: {
      credentials_enable_service: false,
      download: {
        prompt_for_download: false,
        directory_upgrade: true
      },
      intl: {
        accept_languages: languages
      },
      profile: {
        password_manager_enabled: false
      },
      safebrowsing_for_trusted_sources_enabled: false,
      safebrowsing: {
        enabled: false
      },
      webkit: {
        webprefs: {
          javascript_can_access_clipboard: true
        }
      }
    }
  })
}

export default async function (
  chromiumOptions = { headless: false, timeout: 20000, devtools: false, languages: 'en' }
) {
  chromiumOptions = { headless: false, timeout: 20000, devtools: false, languages: 'en', ...chromiumOptions }

  if (chromiumOptions.headless) {
    profile.args.push('--window-size=1920,1080')
  } else {
    profile.args.push('--start-maximized')
  }

  puppeteer.use(preferences(chromiumOptions.languages))
  puppeteer.use(lutkar())

  return await puppeteer.launch({
    ...profile,
    devtools: chromiumOptions.devtools,
    headless: chromiumOptions.headless,
    timeout: chromiumOptions.timeout
  })
}
