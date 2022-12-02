/**
 * Services configuration
 */
 module.exports = {
    'logger': getEnv('SERVICE_LOGGER', true),
    'cron': getEnv('SERVICE_CRON', true),
    'auth': getEnv('SERVICE_AUTH', true),
    'mongo': getEnv('SERVICE_MONGO', true),
    'mail': getEnv('SERVICE_MAIL', true),
 }