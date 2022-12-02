/**
 * @class AuthController
 * @description Handles user authentication
 */
module.exports = class AuthController {
  /**
   * @constructor
   * @description Handles autoloaded dependencies
   */
  constructor(app) {
    this.user_model = app.get('UserModel')
    this.crypt_helper = app.get('CryptHelper')

    this.auth_validator = app.get('AuthValidator')
  }

  /**
   * @method login
   * @description Returns successfully logged in user and passport bearer token
   * @param {object} request
   * @param {object} response
   * @return {object} response
   */
  async login(request, response) {
    try {
      /** Request validation */
      let validation = this.auth_validator.validateLogin(request, response)
      if (validation.error) return response.status(400).send({ message: 'Validation error', errors: validation.errors })

      let user = await this.user_model.findOne({ email: request.body.email })

      if (!user) return response.status(401).send({ message: 'Invalid Credentials' })
      if (user.status == 'pending' || user.status == 'blocked') {
        return response.status(400).json({ message: 'Email not verified or the user is blocked.' })
      }

      let generated_password = auth.hashPassword(request.body.password, Config.app('salt'))

      if (generated_password !== user.password) {
        return response.status(401).json({ message: 'Password mismatched.' })
      }

      delete user._doc.password

      await this.user_model.findOneAndUpdate(
        { _id: user._id },
        { $set: { last_login: new Date() } },
        { new: true, useFindAndModify: false }
      )

      response.status(200).json({ user: user, token: auth.generateToken(user.id.toString()) })
    } catch (err) {
      console.log({ err })
      logger.log({
        level: 'error',
        message: err
      })
      return response.status(400).send({ message: 'Something went wrong' })
    }
  }

  /**
   * @method logs
   * @description Returns logs string
   * @param {object} request
   * @param {object} response
   * @return {object} response
   */
  async logs(request, response) {
    try {
      let data = fs.readFileSync(root_directory + 'logs/error.log', 'utf8')
      data = data.replace(/    /g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      data = data.replace(/(?:\r\n|\r|\n)/g, '<br>')
      response.status(200).send(data)
    } catch (err) {
      logger.log({
        level: 'error',
        message: err
      })
      return response.status(400).send({ message: 'Something went wrong' })
    }
  }

  /**
   * @method changePassword
   * @description Changed password of user
   * @param {object} request
   * @param {object} response
   * @return {object} response
   */
  async changePassword(request, response) {
    try {
      /** Request validation */
      let validation = this.auth_validator.validateChangePassword(request, response)
      if (validation.error) return response.status(400).send({ message: 'Validation error', errors: validation.errors })

      let user = await this.user_model.findOne({ _id: request.user._id })
      if (user == null) {
        return response.status(200).json({ message: 'User does not exist' })
      }

      let generated_password = auth.hashPassword(request.body.current_password, Config.app('salt'))
      if (generated_password !== request.user.password) {
        return response.status(200).json({ message: 'Invalid current password' })
      }

      let new_password = auth.hashPassword(request.body.new_password, Config.app('salt'))
      user.password = new_password
      let updated = await user.save()
      if (updated.updatedCount == 0) return response.status(400).json({ message: 'Unable to change password' })

      /** Response */
      return response.status(200).json({ message: 'Password changed successfully' })
    } catch (err) {
      logger.log({
        level: 'error',
        message: err
      })
      return response.status(400).send({ message: 'Something went wrong' })
    }
  }

  /**
   * @method forgetPassword
   * @description Changed password of user
   * @param {object} request
   * @param {object} response
   * @return {object} response
   */
  async forgetPassword(request, response) {
    try {
      /** Request validation */
      let validation = this.auth_validator.validateForgetPassword(request, response)
      if (validation.error) return response.status(400).send({ message: 'Validation error', errors: validation.errors })

      let user = await this.user_model.findOne({ email: request.body.email })
      if (!user) {
        return response.status(400).json({ message: 'No user associated with provided email' })
      }

      // user.reset_password_token = auth.generateToken(user._id.toString())
      user.reset_password_token = this.crypt_helper.generateToken(user._id.toString())
      user.reset_password_created_at = Date.now() + 3600000 // 1 hour
      await user.save()

      /** Email dispatch */
      let template = this.reset_password_email.template(
        user.reset_password_token,
        Config.app('base_url'),
        user.email,
        `${user.first_name} ${user.last_name}`,
        Config.app('app_name')
      )

      await mail.send(template, 'Reset Password', user.email)

      /** Response */
      return response.status(200).send({ message: 'Reset password successful' })
    } catch (err) {
      logger.log({
        level: 'error',
        message: err
      })
      return response.status(400).send({ message: 'Something went wrong' })
    }
  }

  /**
   * @method resetPassword
   * @description Changed password of user
   * @param {object} request
   * @param {object} response
   * @return {object} response
   */
  async resetPassword(request, response) {
    try {
      /** Request validation */
      let validation = this.auth_validator.validateResetPassword(request, response)
      if (validation.error) return response.status(400).send({ message: 'Validation error', errors: validation.errors })

      let user = await this.user_model.findOne({
        reset_password_token: request.params.token,
        reset_password_created_at: { $gt: Date.now() }
      })
      if (!user) {
        return response.status(400).json({ message: 'Password reset request has been expired' })
      }
      user.password = auth.hashPassword(request.body.password, Config.app('salt'))
      user.reset_password_token = null
      user.status = 'active'
      user.verified_at = new Date()
      let updated = await user.save()
      if (updated.updatedCount == 0) return response.status(400).json({ message: 'Unable to reset password' })

      /** Response */
      return response.status(200).json({ message: 'Password reset successful' })
    } catch (err) {
      logger.log({
        level: 'error',
        message: err
      })
      return response.status(400).send({ message: 'Something went wrong' })
    }
  }
}
