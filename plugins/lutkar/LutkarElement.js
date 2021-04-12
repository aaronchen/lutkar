import Utils from '../../helpers/Utils.js'
import LutkarHelper from './LutkarHelper.js'

/*
 * ##### LutkarElement: ElementHandle Methods #####
 */

class LutkarElement {
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

  async $eval(selector, pageFunction, ...args) {
    const childElement = await this.$(selector)
    return await childElement.evaluate(pageFunction, ...args)
  }

  async $x(expression) {
    const elements = await this.__$x(expression)
    return LutkarHelper.lutkarifyElements(elements)
  }

  async $find(selector) {
    if (LutkarHelper.isXPath(selector)) {
      return await this.$x(selector)
    } else {
      return await this.$$(selector)
    }
  }

  async addClass(cssClass) {
    await this.evaluate((element, cssClass) => element.classList.add(...cssClass.split(/\s+/)), cssClass)
  }

  async blur() {
    await this.evaluate((element) => element.blur())
  }

  async children() {
    const childrenHandle = await this.evaluateHandle((element) => element.children)
    const childrenProperties = await childrenHandle.getProperties()
    const children = []

    for (const childProperty of childrenProperties.values()) {
      const childElement = childProperty.asElement()

      if (childElement) {
        children.push(LutkarHelper.lutkarifyElement(childElement))
      }
    }

    return children
  }

  async clear() {
    await this.evaluate((element) => (element.value = ''))
  }

  async closest(selector) {
    if (LutkarHelper.isXPath(selector)) {
      const expression = `./ancestor-or-self::${selector.replace(/^\/+/, '')}`
      const parents = await this.$x(expression)
      return parents.length ? parents[0] : null
    } else {
      const elementHandle = await this.evaluateHandle((element, selector) => element.closest(selector), selector)
      return LutkarHelper.lutkarifyElement(elementHandle.asElement())
    }
  }

  async controlClick(cmdKey = 'Control') {
    const page = this._page || this._frameManager._page

    await page.keyboard.down(cmdKey)
    await this.click()
    await page.keyboard.up(cmdKey)
  }

  async copyAndPaste(text, cmdKey = 'Control') {
    const page = this._page || this._frameManager._page

    await page.copyToClipboard(text)
    await this.focus()
    await page.pasteFromClipboard(cmdKey)
  }

  async doubleClick(clickOptions = {}) {
    return await this.click({ ...clickOptions, clickCount: 2 })
  }

  async drawRectangle(options = { color: '#f33', top: 4, right: 8, bottom: 4, left: 8 }) {
    options = { color: '#f33', top: 4, right: 8, bottom: 4, left: 8, ...options }

    const rectangleHandle = await this.evaluateHandle(
      (element, id, options) => {
        let rect = element.getBoundingClientRect()

        let rectangle = window.document.createElement('div')
        rectangle.id = id
        rectangle.style.border = `3px solid ${options.color}`
        rectangle.style.display = 'block'
        rectangle.style.height = rect.height + options.top + options.bottom + 'px'
        rectangle.style.left = window.scrollX + rect.x - options.left + 'px'
        rectangle.style.margin = '0px'
        rectangle.style.padding = '0px'
        rectangle.style.position = 'absolute'
        rectangle.style.top = window.scrollY + rect.y - options.top + 'px'
        rectangle.style.width = rect.width + options.left + options.right + 'px'
        rectangle.style.zIndex = '99999'

        window.document.body.appendChild(rectangle)

        return rectangle
      },
      'lutkar_' + Utils.randomString(),
      options
    )

    return LutkarHelper.lutkarifyElement(rectangleHandle.asElement())
  }

  async drawText(text, options = { color: '#f33', fontSize: 16, top: 5, right: 20 }) {
    options = { color: '#f33', fontSize: 16, top: 5, right: 20, ...options }

    const textHandle = await this.evaluateHandle(
      (element, text, id, options) => {
        let rect = element.getBoundingClientRect()

        let textBox = window.document.createElement('div')
        textBox.id = id
        textBox.innerText = text
        textBox.style.border = 'none'
        textBox.style.color = options.color
        textBox.style.display = 'block'
        textBox.style.fontFamily = 'Verdana, sans-serif'
        textBox.style.fontSize = options.fontSize + 'px'
        textBox.style.fontWeight = 'bold'
        textBox.style.left = window.scrollX + rect.x + 'px'
        textBox.style.margin = '0'
        textBox.style.padding = '0'
        textBox.style.position = 'absolute'
        textBox.style.right = options.right + 'px'
        textBox.style.top = window.scrollY + rect.y + rect.height + options.top + 'px'
        textBox.style.zIndex = '99999'

        window.document.body.appendChild(textBox)

        return textBox
      },
      text,
      'lutkar_' + Utils.randomString(),
      options
    )

    return LutkarHelper.lutkarifyElement(textHandle.asElement())
  }

  async firstChild() {
    const firstElementHandle = await this.evaluateHandle((element) => element.firstElementChild)
    return LutkarHelper.lutkarifyElement(firstElementHandle.asElement())
  }

  async getAttribute(attribute) {
    return await this.evaluate((element, attribute) => element.getAttribute(attribute), attribute)
  }

  async getProperty(property) {
    const propertyHandle = await this.__getProperty(property)
    return propertyHandle.jsonValue()
  }

  async hasAttribute(attribute) {
    return await this.evaluate((element, attribute) => element.hasAttribute(attribute), attribute)
  }

  async hasAttributeValue(attribute, value) {
    const attributeValue = await this.getAttribute(attribute)
    return attributeValue && attributeValue.includes(value)
  }

  async hasClass(className) {
    return await this.evaluate((element, className) => element.classList.contains(className), className)
  }

  async hasText(text) {
    const elementText = await this.text()
    return elementText && elementText.includes(text)
  }

  async hide() {
    await this.evaluate((element) => (element.style.display = 'none'))
  }

  async isDisplayed() {
    return await this.isIntersectingViewport()
  }

  isEnabled() {
    return !this.disabled
  }

  isSelected() {
    return this.selected
  }

  isStale() {
    return !this.isConnected
  }

  async lastChild() {
    const lastElementHandle = await this.evaluateHandle((element) => element.lastElementChild)
    return LutkarHelper.lutkarifyElement(lastElementHandle.asElement())
  }

  async nextSibling() {
    const nextSiblingHandle = await this.evaluateHandle((element) => element.nextElementSibling)
    return LutkarHelper.lutkarifyElement(nextSiblingHandle.asElement())
  }

  async parentElement() {
    const parentElementHandle = await this.evaluateHandle((element) => element.parentElement)
    return LutkarHelper.lutkarifyElement(parentElementHandle.asElement())
  }

  async previousSibling() {
    const previousSiblingHandle = await this.evaluateHandle((element) => element.previousElementSibling)
    return LutkarHelper.lutkarifyElement(previousSiblingHandle.asElement())
  }

  async remove() {
    await this.evaluate((element) => element.remove())
  }

  async removeAttribute(attribute) {
    await this.evaluate((element, attribute) => {
      if (element.hasAttribute(attribute)) {
        element.removeAttribute(attribute)
      }
    }, attribute)
  }

  async rightClick(clickOptions = {}) {
    return await this.click({ ...clickOptions, button: 'right' })
  }

  async scrollIntoView(options = { behavior: 'auto', block: 'center', inline: 'center' }) {
    await this.evaluate((element, options) => element.scrollIntoView(options), options)
  }

  async selectOptions(byAttribute, byAttributeValue) {
    await this.validateTagName('select')

    const options = await this.$$('option')

    if (byAttribute && byAttributeValue) {
      const filteredOptions = []
      for (const option of options) {
        if (await option.hasAttributeValue(byAttribute, byAttributeValue)) {
          filteredOptions.push(option)
        }
      }
      return filteredOptions
    }

    return options
  }

  async selectedOptions(by) {
    await this.validateTagName('select')

    const selectedHandle = await this.evaluateHandle((element) => element.selectedOptions)
    const selectedProperties = await selectedHandle.getProperties()
    const selectedOptions = []

    for (const selectedProperty of selectedProperties.values()) {
      const selectedOption = selectedProperty.asElement()

      if (selectedOption) {
        selectedOptions.push(LutkarHelper.lutkarifyElement(selectedOption))
      }
    }

    if (by && selectedOptions.length) {
      const bySelected = []

      if (by == 'value') {
        for (const option of selectedOptions) {
          bySelected.push(await option.value())
        }
      } else if (by == 'text') {
        for (const option of selectedOptions) {
          bySelected.push(await option.text())
        }
      } else if (by == 'index') {
        for (const option of selectedOptions) {
          bySelected.push(await option.getProperty('index'))
        }
      }

      return bySelected
    }

    return selectedOptions
  }

  async setAttribute(attribute, value) {
    await this.evaluate(
      (element, attribute, value) => {
        element.setAttribute(attribute, value)
      },
      attribute,
      value
    )
  }

  async tagName() {
    return await this.evaluate((element) => element.tagName)
  }

  async text() {
    return await this.evaluate((element) => element.innerText)
  }

  async textContent() {
    return await this.evaluate((element) => element.textContent)
  }

  async toggleAttribute(attribute) {
    return await this.evaluate((element, attribute) => element.toggleAttribute(attribute), attribute)
  }

  async toggleClass(className) {
    return await this.evaluate((element, className) => element.classList.toggle(className), className)
  }

  async trigger(eventName, eventInit = { bubbles: false, cancelable: false, composed: false }) {
    return await this.evaluate(
      (element, eventName, eventInit) => element.dispatchEvent(new Event(eventName, eventInit)),
      eventName,
      eventInit
    )
  }

  async validateTagName(name) {
    name = name.toUpperCase()
    const tagName = await this.tagName()

    if (name !== tagName) {
      throw new Error(`Not a ${name} element (is ${tagName})`)
    }
  }

  async value() {
    return await this.evaluate((element) => element.value)
  }
}

export default LutkarElement
