process.env.DEBUG = false

global.__skip_hooks = false
global.__skip_server = false
global.__token = ''

/** Skipping publish process */
global.__skip_publishing_asset = true
if (!__skip_publishing_asset) {
    process.env.CRON_ENABLED = true
    process.env.REDIS_ENABLED = true
}

require('./common/boot.test')

require('./features/user.test')

require('./common/close.test')