import LutkarBrowser from './LutkarBrowser.js'
import LutkarTarget from './LutkarTarget.js'
import LutkarPage from './LutkarPage.js'
import LutkarFrame from './LutkarFrame.js'
import LutkarElement from './LutkarElement.js'
import Storage from './Storage.js'

/*
 * ##### LutkarHelper: Helper Methods #####
 */

const LutkarHelper = {
  isXPath: function (selector) {
    return selector.startsWith('/') || selector.startsWith('(') || selector.startsWith('./')
  },

  lutkarifyBrowser: function (browser) {
    return bindLutkarClassToObject(LutkarBrowser, browser)
  },

  lutkarifyElement: function (element) {
    return bindLutkarClassToObject(LutkarElement, element)
  },

  lutkarifyElements: function (elements) {
    return elements.map((element) => LutkarHelper.lutkarifyElement(element))
  },

  lutkarifyFrame: function (frame) {
    return bindLutkarClassToObject(LutkarFrame, frame)
  },

  lutkarifyPage: function (page) {
    bindLutkarClassToObject(LutkarPage, page)

    page.localStorage = new Storage(page, 'localStorage')
    page.sessionStorage = new Storage(page, 'sessionStorage')

    return page
  },

  lutkarifyPages: function (pages) {
    return pages.map((page) => LutkarHelper.lutkarifyPage(page))
  },

  lutkarifyTarget: function (target) {
    return bindLutkarClassToObject(LutkarTarget, target)
  },

  lutkarifyTargets: function (targets) {
    return targets.map((target) => LutkarHelper.lutkarifyTarget(target))
  },

  parseCSS: function (selector) {
    const re = /(.*):eq\((\d+)\)/
    const found = selector.match(re)

    if (found) {
      return { selector: found[1], index: found[2] }
    } else {
      return { selector: selector, index: null }
    }
  }
}

/*
 * Internal Use Only
 */

function bindLutkarClassToObject(klass, object) {
  if (object == null || object.__lutkarified) return object

  object.__lutkarified = true

  let klassProtoType = klass.prototype

  while (klassProtoType && klassProtoType !== Object.prototype) {
    Object.getOwnPropertyNames(klassProtoType).forEach((methodName) => {
      if (methodName !== 'constructor') {
        if (typeof object[methodName] === 'function' && object[`__${methodName}`] === undefined) {
          object[`__${methodName}`] = object[methodName]
        }
        object[methodName] = klass.prototype[methodName].bind(object)
      }
    })

    klassProtoType = Object.getPrototypeOf(klassProtoType)
  }

  return object
}

export default LutkarHelper
