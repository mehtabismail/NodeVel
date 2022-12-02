/**
 * Container Class
 * @description Container allows to attach or preload dependencies
 */
module.exports = class container {
  constructor(app) {

    app.controller('AuthController').inject(['models.UserModel', 'helpers.CryptHelper']).validators(['AuthValidator'])
    
  }
}
