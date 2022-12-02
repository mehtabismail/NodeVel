module.exports = class Config
{

    constructor() {
        if(process.env.MODULES){
            const modules = process.env.MODULES.split(',')
            this.module = modules[0]
        }else{
            this.module = 'app'
        }
        this.app_configs = use(this.module + '.configs.app')
        this.database_configs = use(this.module + '.configs.database')
        this.service_configs = use(this.module + '.configs.service')
        this.auth_configs = use(this.module + '.configs.auth')
        this.email_configs = use(this.module + '.configs.email')
    }

    setModule(name) {
        this.module = name
    }

    app(key) {
        let value = ''
        key.split('.').forEach(k => {
            if(value == '') {
                value = this.app_configs[k]
            }else{
                value = value[k]
            }
        })
        if(value === undefined || value == null || value == '') value = this.database(key)
        if(value === undefined || value == null || value == '') value = this.service(key)
        if(value === undefined || value == null || value == '') value = this.auth(key)
        if(value === undefined || value == null || value == '') value = this.email(key)
        return value
    }

    database(key) {
        let value = ''
        key.split('.').forEach(k => {
            if(value == '') {
                value = this.database_configs[k]
            }else{
                value = value[k]
            }
        })
        return value
    }

    service(key) {
        let value = ''
        key.split('.').forEach(k => {
            if(value == '') {
                value = this.service_configs[k]
            }else{
                value = value[k]
            }
        })
        return value
    }

    auth(key) {
        let value = ''
        key.split('.').forEach(k => {
            if(value == '') {
                value = this.auth_configs[k]
            }else{
                value = value[k]
            }
        })
        return value
    }

    email(key) {
        let value = ''
        key.split('.').forEach(k => {
            if(value == '') {
                value = this.email_configs[k]
            }else{
                value = value[k]
            }
        })
        return value
    }

    get(key) {
        let value = ''
        let keys = key.split('.')
        let configs = {}
        if(keys.length > 1) {
            configs = use(this.module + '.configs.' + keys[0])
        }
        keys.forEach(k => {
            if(value == '') {
                value = configs[k]
            }else{
                value = value[k]
            }
        })
        return value
    }

}