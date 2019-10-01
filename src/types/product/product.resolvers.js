import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const products = () => {
  return Product.find({}).exec()
}

const product = (_, { id }) => {
  return Product.findById(id).exec()
}

const newProduct = async (_, { input }, ctx) => {
  const product = { ...input, createdBy: ctx.user._id }
  const res = await Product.create(product)
  return res
}

const updateProduct = async (_, { id, input }) => {
  return await Product.findByIdAndUpdate(id, input, { new: true })
    .lean()
    .exec()
}

const removeProduct = async (_, { id }) => {
  return await Product.findByIdAndRemove(id)
    .lean()
    .exec()
}

const createdBy = async product => {
  return await User.findById(product.createdBy)
    .lean()
    .exec()
}
export default {
  Query: {
    products,
    product
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy
  }
}
