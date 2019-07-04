const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId
const moment = require('moment')
const config = require('../../../config')
const encryptionUtil = require('../../../utils/encryptionUtil')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema(
  {
    // 用户名
    username: { type: String, trim: true },
    // 昵称
    nickname: { type: String, trim: true },
    // 邮箱
    email: { type: String, trim: true },
    // 密码 (AES 加密)
    password: { type: String },
    // 密码盐
    salt: { type: String },
    // 身份
    role: { type: ObjectId, ref: 'Role' },
    // 创建日期
    createDateTime: {
      type: String,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    // 最后修改时间
    updateDateTime: {
      type: String,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    // 最后登录时间
    lastLoginDateTime: {
      type: String,
      default: '1970-01-01 00:00:00'
    }
  },
  {
    versionKey: false,
    toObject: {
      getters: true,
      transform: function(doc, ret, options) {
        delete ret._id
        return ret
      }
    },
    toJSON: {
      getters: true,
      transform: function(doc, ret, options) {
        delete ret._id
        return ret
      }
    }
  }
)

// 重写 mongoose 的默认方法会造成无法预料的结果。
// 不要在自定义方法中使用 ES6 箭头函数，会造成 this 指向错误。

/**
 * 登录
 * @param loginName 登录名
 * @param password 登录密码
 */
const login = async function(loginName, password) {
  const user = await this.findOne({
    $or: [{ username: loginName }, { email: loginName }]
  })
  if (!user) return { error: 'user is not exists.' }
  // 将输入的密码与找到的用户的盐进行加密后 与数据库中加密的密码进行比对
  const { result } = encryptionUtil.aesEncrypt(password, user.salt)
  if (user.password === result) {
    user.lastLoginDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    await user.save()
    const token = jwt.sign({ id: user.id }, config.SECRET_KEY, {
      expiresIn: '7 days'
    })
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname || '',
      token
    }
  }
  return { error: 'password is wrong.' }
}
/**
 *  检查是否存在
 * @param prop 字段名称
 * @param value 值
 */
const checkExists = async function(prop, value) {
  const count = await this.countDocuments({ [prop]: value })
  return !!count
}
/**
 * 注册
 * @param inputUser :Object 输入的用户对象
 */
const register = async function(inputUser) {
  const { username, password, email, role, nickname } = inputUser
  if (!username || !password || !email)
    return { error: 'please input username, password or email.' }

  const users = await this.find({ $or: [{ username }, { email }] })
  if (users.length) return { error: 'username or email has been used.' }

  // 密码加密
  const { result, salt } = encryptionUtil.aesEncrypt(password)
  const createUser = { username, password: result, salt, email }
  if (role) createUser.role = role
  if (nickname) createUser.nickname = nickname
  await this.create(createUser)
  return { message: `user ${username} create success.` }
}

/**
 * 更新用户 无 id 则创建
 * @param inputUser 输入的用户对象
 */
const updateUser = async function(inputUser) {
  const id = inputUser.id
  if (id) {
    delete inputUser.id
    if (inputUser.password != '') {
      const originUser = await this.findById(id)
      if (!originUser) return { error: `User is not exists who's id ${id}.` }
      const { result, salt } = encryptionUtil.aesEncrypt(inputUser.password)
      inputUser.password = result
      inputUser.salt = salt
    } else {
      delete inputUser.password
    }
    await this.findByIdAndUpdate(id, inputUser)
    return { message: `User is updated who's id ${id}` }
  } else {
    return this.register(inputUser)
  }
}

/**
 * 修改密码
 * @param inputUser
 */
const updatePassword = async function(inputUser) {
  const user = await this.findById(inputUser.id)
  if (!user) return { error: `Not Found Userid ${id}.` }
  const { result } = encryptionUtil.aesEncrypt(inputUser.password, user.salt)
  if (user.password != result) return { error: 'current password is wrong.' }
  return await this.updateUser({
    id: inputUser.id,
    password: inputUser.modifyPassword
  })
}

// 用户分页模糊搜索列表
const listByKeyword = async function(page, size, keyword) {
  if (!page || !size) return { error: 'Missing field "page" or "size".' }
  const users = await this.find(
    {
      $or: [
        { username: new RegExp(keyword, 'i') },
        { email: new RegExp(keyword, 'i') },
        { nickname: new RegExp(keyword, 'i') }
      ]
    },
    { password: 0, salt: 0 }
  )
  return users
}

Object.assign(UserSchema.statics, {
  login,
  checkExists,
  register,
  updateUser,
  updatePassword,
  listByKeyword
})

const User = mongoose.model('User', UserSchema)
