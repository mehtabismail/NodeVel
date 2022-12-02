const asana = require('asana')

/**
 * @class passport
 * @description Initialization of passport strategy, verification of given token in header
 */
module.exports = class passport {
  /**
   * @method index
   * @description Authenticate user by verifying given token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
  async index(req, res, next) {
    auth.initPassport()
    const passport = auth.getPassportInstance()
    passport.authenticate('bearer', function (err, user) {
      // console.log('app.middlwares.passport:19 => ', err)
      if (err != null) return res.status(401).json({ message: err })
      if (!user) return res.status(401).json({ message: 'Authorization token is required' })

      req.user = user

      const client = asana.Client.create().useAccessToken(getEnv('ASANA_PERSONAL_ACCESS_TOKEN'))
      req.asanaClient = client

      next()
    })(req, res, next)
  }
}
