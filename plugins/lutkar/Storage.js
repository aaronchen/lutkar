import Utils from '../../helpers/Utils.js'

class Storage {
  constructor(page, storageType) {
    if (!['localStorage', 'sessionStorage'].includes(storageType)) {
      throw new Error(`localStorage and sessionStorage are the only supported storage types: ${storageType}`)
    }

    this.page = page
    this.storageType = storageType
  }

  async clear() {
    await this.page.evaluate((storageType) => {
      window[storageType].clear()
    }, this.storageType)
  }

  async get(name) {
    return await this.page.evaluate(
      (storageType, name) => {
        return window[storageType].getItem(name)
      },
      this.storageType,
      name
    )
  }

  async has(name) {
    const names = await this.keys()
    return names.includes(name)
  }

  async items() {
    return await this.page.evaluate((storageType) => {
      const storage = window[storageType]
      const items = {}
      Object.keys(storage).forEach(function (key) {
        items[key] = storage.getItem(key)
      })
      return items
    }, this.storageType)
  }

  async keys() {
    return await this.page.evaluate((storageType) => {
      return Object.keys(window[storageType])
    }, this.storageType)
  }

  async load(jsonFile) {
    const json = Utils.readJSON(jsonFile)

    for (const key in json) {
      await this.set(key, json[key])
    }
  }

  async remove(name) {
    await this.page.evaluate(
      (storageType, name) => {
        window[storageType].removeItem(name)
      },
      this.storageType,
      name
    )
  }

  async set(name, value) {
    await this.page.evaluate(
      (storageType, name, value) => {
        window[storageType].setItem(name, value)
      },
      this.storageType,
      name,
      value
    )
  }

  async storageEnabled() {
    return await this.page.evaluate((storageType) => {
      try {
        const uid = new Date()
        window[storageType].setItem(uid, uid)
        window[storageType].removeItem(uid)
        return true
      } catch (exception) {
        return false
      }
    }, this.storageType)
  }
}

export default Storage
