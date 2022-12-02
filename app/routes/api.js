/**
 * Api routes
 * @description All api related routes can be defined here accordingly
 */

/**
 * @prefix /api/v1
 * @description Prefix {/api/v1} will be prepended all routes urls
 */

/**
 * You can use a prefix for every route here
 */
// Router.prefix('/api/v1')

/** 
 * Test route for check if server is responding
 */
Router.get('/test', (request, response) => {
  return response.status(200).send({ message: 'OK' })
})

/** 
 * Logs route to checking backend error logs via APIs
 */
Router.get('/logs', 'AuthController@logs')


/** Open auth routes */
Router.post('/login', 'AuthController@login')
Router.post('/auth/forget-password', 'AuthController@forgetPassword')
Router.post('/auth/reset-password/:token', 'AuthController@resetPassword')



/**
 * @middleware app.middlewares.passport
 * @description Passport middleware will be applied to all routes inside callback function
 */
Router.middleware(['app.middlewares.passport'], (_router) => {
  
  /** General routes */
  Router.post('/auth/change-password', 'AuthController@changePassword')

  _router.get('/all', 'LoginController@index')
  Router.post('/create', 'LoginController@store')
// _router.post('/create', 'LoginController@store')


})
