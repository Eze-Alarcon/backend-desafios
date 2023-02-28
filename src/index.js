/* eslint space-before-function-paren: 0 */

import fs from 'fs/promises'
import { validateInputs, searchMatch } from './logic/validations.js'

const ERRORS = {
  NOT_FOUND: '[ERROR 404]: Product not found'
}

const SUCCESS = {
  CREATED: '[STATUS 201]: Item created successfully',
  UPDATED: '[STATUS 200]: Item updated successfully',
  DELETED: '[STATUS 200]: Item removed successfully',
  GET: '[STATUS 200]: Item found successfully'
}

function* idFactory() {
  let id = 0
  while (true) { yield ++id }
}

const makeProductId = idFactory()

class Products {
  constructor({
    title,
    description,
    price,
    thumbnail,
    code,
    stock = 0,
    id = null
  }) {
    this.id = id ?? makeProductId.next().value
    this.title = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.stock = stock
    this.code = code ?? `product-${this.id}`
  }
}

class ProductManager {
  #path
  constructor(path) {
    this.#path = path
    this.productsList = []
  }

  async addProduct(fields) {
    const validate = validateInputs(fields)
    if (validate.error) return { msg: validate.msg }

    const { id, code } = fields
    const matches = searchMatch({ id, code }, this.productsList)
    if (matches.error) return { msg: matches.msg }

    const newProduct = new Products(fields)
    this.productsList.push(newProduct)

    await this.#writeData()

    return {
      msg: SUCCESS.CREATED,
      productAdded: newProduct
    }
  }

  async #writeData() {
    const json = JSON.stringify(this.productsList, null, 2)
    await fs.writeFile(this.#path, json)
  }

  async #loadData() {
    const raw = await fs.readFile(this.#path, 'utf-8')
    if (raw === '') return []
    return JSON.parse(raw)
  }

  async getProducts() {
    const data = await this.#loadData()
    this.productsList = [...data]
    return this.productsList
  }

  async getProductById(productId) {
    await this.getProducts()
    const product = this.productsList.find((item) => item.id === productId)
    if (product === undefined) {
      return {
        msg: ERRORS.NOT_FOUND,
        error: true
      }
    }
    return {
      msg: SUCCESS.GET,
      item: product
    }
  }

  async updateProduct(productId, fields) {
    const product = await this.getProductById(productId)
    if (product.error) return { msg: product.msg }

    const validate = validateInputs(fields)
    if (validate.error) return { msg: validate.msg }

    const {
      title,
      description,
      price,
      thumbnail,
      stock
    } = fields

    product.item.description = description ?? product.item.description
    product.item.thumbnail = thumbnail ?? product.item.thumbnail
    product.item.title = title ?? product.item.title
    product.item.price = price ?? product.item.price
    product.item.stock = stock ?? product.item.stock

    await this.#writeData()
    return {
      msg: SUCCESS.UPDATED,
      itemUpdated: product.item
    }
  }

  async deleteProduct(productId) {
    await this.getProducts()
    const productIndex = this.productsList.findIndex((item) => item.id === productId)
    if (productIndex === -1) return { msg: ERRORS.NOT_FOUND }

    const itemDeleted = this.productsList.splice(productIndex, 1)
    await this.#writeData()

    return {
      msg: SUCCESS.DELETED,
      itemDeleted
    }
  }
}
