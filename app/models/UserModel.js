const mongoose = require('mongoose')

/**
 * @class UserModel
 * @description Creates a mongoose user model and defines its schema
 */
module.exports = class UserModel {
  /**
   * @constructor
   * @returns {mongoose.model} UserModel
   */
  constructor() {
    return mongoose.model('users', Schema, 'users')
  }
}

/**
 * Mongoose Schema
 */
const Schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, required: true, unique: true },
    phone: { type: String, default: '' },
    password: { type: String, default: '' },
    photo: { type: String, default: '' },
    type: {
      type: String,
      default: 'user',
      enum: ['admin', 'user']
    },
    status: {
      type: String,
      default: 'active',
      enum: ['pending', 'active', 'blocked']
    },
    token: String,
    blocked_at: { type: Date, default: null },
    last_login: { type: Date, default: null },
    created_by: { type: String, default: null },
    deleted_at: { type: Date, default: null },
    updated_by: { type: String }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)
