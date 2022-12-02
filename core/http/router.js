// const sync = resolveOnce('core.timing.sync')
const jwt = require('jsonwebtoken')

module.exports = class Router {

    prefix(name) {
        this.__prefix = name
    }

    setMiddlewares(middlewares) {
        this.middlewares = middlewares
    }

    setHook(hook) {
        this.hook = hook
    }

    server(express_app) {
        this.express_app = express_app
        this.__prefix = ''
        this.middlewares = []
    }

    middleware(middleware_array, callback) {
        this.setMiddlewares(middleware_array)
        callback(this)
        this.setMiddlewares([])
    }

    getResolvedMiddlewares() {
        let resolvedMiddlewares = []
        for (let i = 0; i < this.middlewares.length; i++) {
            let resolved_middlware = resolve(this.middlewares[i])
            if (resolved_middlware['index'] !== undefined) {
                resolvedMiddlewares.push(resolved_middlware['index'])
            }
        }
        return resolvedMiddlewares
    }

    get(url, target, secure) {
        if (this.__prefix != '') url = this.__prefix + url
        if (this.routes === undefined) this.routes = []
        if (secure === undefined) secure = false
        this.routes.push({ url: url, target: target, method: 'GET', secure: secure, middlewares: [] })
        this.express_app.get(url, ...this.getResolvedMiddlewares(), (req, res, next) => {
            req.validate = resolve('core.http.validator', res).validate
            req.validateChildren = resolve('core.http.validator', res).validateChildren
            this.hook.routing(this.express_app, req, res)
            this.run(url, req, res, next)
        })
    }

    post(url, target, secure) {
        if (this.__prefix != '') url = this.__prefix + url
        if (this.routes === undefined) this.routes = []
        if (secure === undefined) secure = false
        this.routes.push({ url: url, target: target, method: 'POST', secure: secure, middlewares: [] })
        this.express_app.post(url, ...this.getResolvedMiddlewares(), (req, res, next) => {
            req.validate = resolve('core.http.validator', res).validate
            req.validateChildren = resolve('core.http.validator', res).validateChildren
            this.hook.routing(this.express_app, req, res)
            this.run(url, req, res, next)
        })
    }

    put(url, target, secure) {
        if (this.__prefix != '') url = this.__prefix + url
        if (this.routes === undefined) this.routes = []
        if (secure === undefined) secure = false
        this.routes.push({ url: url, target: target, method: 'PUT', secure: secure, middlewares: [] })
        this.express_app.put(url, ...this.getResolvedMiddlewares(), (req, res, next) => {
            req.validate = resolve('core.http.validator', res).validate
            req.validateChildren = resolve('core.http.validator', res).validateChildren
            this.hook.routing(this.express_app, req, res)
            this.run(url, req, res, next)
        })
    }

    patch(url, target, secure) {
        if (this.__prefix != '') url = this.__prefix + url
        if (this.routes === undefined) this.routes = []
        if (secure === undefined) secure = false
        this.routes.push({ url: url, target: target, method: 'PATCH', secure: secure, middlewares: [] })
        this.express_app.patch(url, ...this.getResolvedMiddlewares(), (req, res, next) => {
            req.validate = resolve('core.http.validator', res).validate
            req.validateChildren = resolve('core.http.validator', res).validateChildren
            this.hook.routing(this.express_app, req, res)
            this.run(url, req, res, next)
        })
    }

    delete(url, target, secure) {
        if (this.__prefix != '') url = this.__prefix + url
        if (this.routes === undefined) this.routes = []
        if (secure === undefined) secure = false
        this.routes.push({ url: url, target: target, method: 'DELETE', secure: secure, middlewares: [] })
        this.express_app.delete(url, ...this.getResolvedMiddlewares(), (req, res, next) => {
            req.validate = resolve('core.http.validator', res).validate
            req.validateChildren = resolve('core.http.validator', res).validateChildren
            this.hook.routing(this.express_app, req, res)
            this.run(url, req, res, next)
        })
    }

    async run(url, req, res, next) {
        if (Config.app('debug') == 'true') console.log(req.method + ' ' + url)
            /** Stops if headers were already sent */
        if (res.headersSent) return
            // if(Config.app('debug') == 'true') sync.benchmark()
            // if(this.__prefix != '') url = this.__prefix + url
            // if(Config.app('debug') == 'true') console.log('HTTP(request) ' + url)
        let response = null
        this.routes.some(route => {
                // console.log(route.url, ' == ', url,' && ',route.method,' == ',req.method)
                if (route.url == url && route.method == req.method) {
                    // console.log('target: ', route.target)
                    if (typeof route.target == 'function') {
                        response = route['target'](req, res);
                    } else {
                        let temp = route.target.split('@');
                        // resolution of dependencies
                        let app_instance = __resolver_cache.isAlreadyResolved(temp[0]);
                        if (app_instance == null) {
                            app_instance = __resolver.resolve(__app_dependencies, temp[0]);
                            __resolver_cache.trackResolvedController(temp[0], app_instance);
                        }
                        let Controller = this.getController(temp[0], app_instance)
                            // console.log(Controller, temp)
                        if (Controller[temp[1]] !== undefined) {
                            response = Controller[temp[1]](req, res);
                        } else {
                            // throw 500
                            console.log('method {' + temp[1] + '} not found on controller {' + temp[0] + '} ...')
                            response = res.status(500).json({})
                        }
                    }
                }
            })
            // if(Config.app('debug') == 'true')  console.log('HTTP(response) ' + sync.benchmarkGet())
        if (response !== null)
            return response
    }

    getController(name, dependencies) {
        return resolve('app.controllers.' + name, dependencies)
    }

    allRoutes() {
        return this.routes
    }

};