import { ElementHandle } from 'puppeteer/lib/cjs/puppeteer/common/JSHandle.js'
import { TimeoutError } from 'puppeteer/lib/cjs/puppeteer/common/Errors.js'
import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarPageFrame: Common Page/Frame Methods #####
 */

class LutkarPageFrame {
  async $(selector) {
    const parsed = LutkarHelper.parseCSS(selector)

    if (parsed.index) {
      const elements = await this.$$(parsed.selector)

      if (elements.length > parsed.index) {
        return elements[parsed.index]
      } else {
        throw new RangeError(`${selector} is out of range: ${parsed.index}`)
      }
    }

    const element = await this.__$(selector)
    return LutkarHelper.lutkarifyElement(element)
  }

  async $$(selector) {
    const elements = await this.__$$(selector)
    return LutkarHelper.lutkarifyElements(elements)
  }

  async $find(selector) {
    if (LutkarHelper.isXPath(selector)) {
      return await this.$x(selector)
    } else {
      return await this.$$(selector)
    }
  }

  async $x(expression) {
    const elements = await this.__$x(expression)
    return LutkarHelper.lutkarifyElements(elements)
  }

  async addClass(selector, cssClass, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await element.addClass(cssClass)
  }

  async blank() {
    await this.goto('about:blank')
  }

  async blur(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await element.blur()
  }

  async check(selector, checked) {
    const element = await this.waitForEnabled(selector, { visible: false })
    return await element.evaluate((element, checked) => {
      element.checked = checked
      return element.checked
    }, checked)
  }

  async children(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return element.children()
  }

  async clear(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await element.clear()
  }

  async clearAndType(selector, text, waitOptions = {}) {
    const element = await this.waitForEnabled(selector, waitOptions)
    await element.clear()
    return await element.type(text)
  }

  async clearDrawings() {
    await this.evaluate(() => {
      const elements = window.document.body.querySelectorAll('[id*="lutkar_"]')
      elements.forEach((element) => element.remove())
    })
  }

  async click(selector, clickOptions = {}, waitOptions = {}) {
    const element = await this.waitForClickable(selector, waitOptions)
    return await element.click(clickOptions)
  }

  async clickToNewPage(selector, clickOptions = {}, waitOptions = {}) {
    await this.click(selector, clickOptions, waitOptions)
    return await this.waitForNewPage()
  }

  async clickAndWait(selector, clickOptions = {}, waitOptions = {}) {
    return await Promise.all([
      this.waitForNavigation(),
      this.waitForClickable(selector, waitOptions).then((el) => el.click(clickOptions))
    ]).then((values) => values[1])
  }

  async controlClick(selector, cmdKey = 'Control', waitOptions = {}) {
    const element = await this.waitForClickable(selector, waitOptions)
    await element.controlClick(cmdKey)
  }

  async copyAndPaste(selector, text, waitOptions = {}, cmdKey = 'Control') {
    const element = await this.waitForEnabled(selector, waitOptions)
    await element.copyAndPaste(text, cmdKey)
  }

  async doubleClick(selector, clickOptions = {}, waitOptions = {}) {
    const element = await this.waitForClickable(selector, waitOptions)
    return await element.doubleClick(clickOptions)
  }

  async drawRectangle(selector, options = { color: '#f33', top: 4, right: 8, bottom: 4, left: 8 }, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    return await element.drawRectangle(options)
  }

  async drawText(selector, text, options = { color: '#f33', fontSize: 16, top: 5, right: 20 }, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    return await element.drawText(text, options)
  }

  async firstChild(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.firstChild()
  }

  async getAttribute(selector, attribute, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.getAttribute(attribute)
  }

  async getProperty(selector, property, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.getProperty(property)
  }

  async hasAttribute(selector, attribute, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.hasAttribute(attribute)
  }

  async hasAttributeValue(selector, attribute, value, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.hasAttributeValue(attribute, value)
  }

  async hasClass(selector, className, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.hasClass(className)
  }

  async hasText(selector, text, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.hasText(text)
  }

  async hide(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await element.hide()
  }

  async isDisplayed(selector, timeout = 2000) {
    const hasElement = await this.isLocated(selector, timeout)
    return hasElement ? await hasElement.isDisplayed() : hasElement
  }

  async isHidden(selector, timeout = 2000) {
    try {
      await this.wait(selector, { hidden: true, timeout: timeout })
      return true
    } catch (e) {
      if (e instanceof TimeoutError) {
        return false
      } else {
        throw e
      }
    }
  }

  async isLocated(selector, timeout = 2000) {
    try {
      return await this.wait(selector, { visible: false, timeout: timeout })
    } catch (e) {
      if (e instanceof TimeoutError) {
        return false
      } else {
        throw e
      }
    }
  }

  async lastChild(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.lastChild()
  }

  async nextSibling(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.nextSibling()
  }

  async parentElement(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.parentElement()
  }

  async previousSibling(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.previousSibling()
  }

  async remove(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await element.remove()
  }

  async removeAttribute(selector, attribute, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    await element.removeAttribute(attribute)
  }

  async rightClick(selector, clickOptions = {}, waitOptions = {}) {
    const element = await this.waitForClickable(selector, waitOptions)
    return await element.rightClick(clickOptions)
  }

  async scrollIntoView(selector, options = { behavior: 'auto', block: 'start', inline: 'nearest' }, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await element.scrollIntoView(options)
  }

  async select(
    selector,
    selection,
    selectOptions = { selected: true, findBy: 'value', unset: false },
    waitOptions = {}
  ) {
    const element = await this.waitForEnabled(selector, waitOptions)
    const options = []

    selectOptions = { selected: true, findBy: 'value', unset: false, ...selectOptions }

    if (selectOptions.unset) await element.evaluate((element) => (element.value = undefined))

    if (!selection) {
      const selectedValues = await element.evaluate((element) => {
        return Array.from(element.selectedOptions).map((option) => option.value)
      })

      for (const value of selectedValues) {
        await LutkarPageFrame.#optionToBe(element, value, false, 'value')
      }
    } else if (Array.isArray(selection)) {
      const isMultiple = await element.evaluate((element) => element.multiple)

      for (const option of selection) {
        options.push(await LutkarPageFrame.#optionToBe(element, option, selectOptions.selected, selectOptions.findBy))
        if (!isMultiple) break
      }
    } else {
      options.push(await LutkarPageFrame.#optionToBe(element, selection, selectOptions.selected, selectOptions.findBy))
    }

    await element.evaluate((element) => {
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
    })

    return options
  }

  async selectOptions(selector, byAttribute, byAttributeValue, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    return await element.selectOptions(byAttribute, byAttributeValue)
  }

  async selectedOptions(selector, by, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    return await element.selectedOptions(by)
  }

  async setAttribute(selector, attribute, value, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    await element.setAttribute(attribute, value)
  }

  async tagName(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.tagName()
  }

  async text(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    return await element.text()
  }

  async textContent(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    return await element.textContent()
  }

  async toggleAttribute(selector, attribute, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.toggleAttribute(attribute)
  }

  async toggleClass(selector, className, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.toggleClass(className)
  }

  async trigger(
    selector,
    eventName,
    eventInit = { bubbles: false, cancelable: false, composed: false },
    waitOptions = {}
  ) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.trigger(eventName, eventInit)
  }

  async type(selector, text, waitOptions = {}) {
    const element = await this.waitForEnabled(selector, waitOptions)
    return await element.type(text)
  }

  async value(selector, waitOptions = {}) {
    const element = await this.wait(selector, { visible: false, ...waitOptions })
    return await element.value()
  }

  async wait(selector, waitOptions = {}) {
    if (selector instanceof ElementHandle) {
      return selector
    }

    if (!selector) {
      throw new Error('selector cannot be empty')
    }

    if (!('visible' in waitOptions) && !('hidden' in waitOptions)) {
      waitOptions.visible = true
    }

    if (LutkarHelper.isXPath(selector)) {
      // XPath
      return await this.waitForXPath(selector, waitOptions)
    } else {
      // CSS
      const parsed = LutkarHelper.parseCSS(selector)

      // If `:eq()` is found
      if (parsed.index) {
        // First, wait for any of `parsed.selector` found
        await this.waitForSelector(parsed.selector, waitOptions)
        // Second, get all elements by `parsed.selector`
        const elements = await this.$$(parsed.selector)
        // Third, filter elements by `waitOptions.visible`
        const waitedElements = elements.filter((element) => waitOptions.visible == (element.boundingBox() != null))

        if (waitedElements.length > parsed.index) {
          return waitedElements[parsed.index]
        } else {
          throw new RangeError(`${selector} is out of range: ${parsed.index}`)
        }
      } else {
        return await this.waitForSelector(selector, waitOptions)
      }
    }
  }

  async waitForClickable(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)

    return await this.waitForFunction(
      (element) => {
        const rect = element.getBoundingClientRect()
        // const x = rect.left + (rect.right - rect.left) / 2
        // const y = rect.top + (rect.bottom - rect.top) / 2

        let elementRoot = element
        while (elementRoot.parentNode) {
          elementRoot = elementRoot.parentNode
        }

        const elementAtPoint = elementRoot.elementFromPoint(rect.x + 1, rect.y + 1)
        if (elementAtPoint == element) return true
        if (elementAtPoint == null) return false

        let elementAtPointRoot = elementAtPoint.parentNode
        while (elementAtPointRoot) {
          if (elementAtPointRoot == element) {
            return true
          }
          elementAtPointRoot = elementAtPointRoot.parentNode
        }

        return false
      },
      {},
      element
    ).then(
      () => element,
      () => {
        throw new TimeoutError(`${selector} is not clickable`)
      }
    )
  }

  async waitForEnabled(selector, waitOptions = {}) {
    const element = await this.wait(selector, waitOptions)
    await this.waitForFunction((element) => !element.disabled, {}, element)
    return element
  }

  async waitForHidden(selector, timeout) {
    return this.wait(selector, { hidden: true, timeout: timeout || this._timeoutSettings.timeout() })
  }

  async waitForLoadingFinished(selector, timeout = 2000, loadingTimeout) {
    let element = null

    try {
      element = await this.wait(selector, { visible: true, timeout: timeout })
    } catch (err) {}

    if (element) {
      await this.waitForHidden(selector, loadingTimeout)
    }
  }

  async waitForNewPage() {
    const browser = this.browser()

    const promise = new Promise((x) => {
      browser.once('targetcreated', async (target) => {
        const newPage = await target.page()
        const newPagePromise = new Promise((y) => newPage.once('domcontentloaded', () => y(newPage)))
        const isPageLoaded = await newPage.evaluate(() => document.readyState)
        isPageLoaded.match('complete') ? x(newPage) : x(newPagePromise)
      })
    })

    return await this.waitForPromise(promise, 'waitForNewPage timed-out')
  }

  async waitForPromise(promise, timeoutMessage = 'Promise timed-out') {
    const timeout = this._timeoutSettings.timeout()

    let timeoutHandle

    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error(timeoutMessage)), timeout)
    })

    return await Promise.race([promise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }

  async waitForSelector(selector, waitOptions = {}) {
    let element = await this.__waitForSelector(selector, waitOptions)
    return LutkarHelper.lutkarifyElement(element)
  }

  async waitForXPath(selector, waitOptions = {}) {
    let element = await this.__waitForXPath(selector, waitOptions)
    return LutkarHelper.lutkarifyElement(element)
  }

  /*
   * ##### Private Methods #####
   */

  static async #optionToBe(selectElement, selection, selected, findBy) {
    let option

    if (findBy == 'value') option = await selectElement.$(`[value="${selection}"]`)
    else if (findBy == 'text') [option] = await selectElement.$x(`descendant::*[text()="${selection}"]`)
    else if (findBy == 'index') {
      const options = await selectElement.$$(`option`)
      const index = parseInt(selection)
      if (index < options.length) option = options[index]
    } else {
      option = await selectElement.$(`[${findBy}="${selection}"]`)
    }

    if (!option) throw new Error(`Cannot use "${findBy}" to locate option: ${selection}`)

    if (option.selected !== selected) {
      await option.evaluate((element, selected) => (element.selected = selected), selected)
    }

    return option
  }
}

export default LutkarPageFrame
