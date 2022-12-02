/**
 * Application configurations loaded up from environment variables.
 */
module.exports = {
    'env': getEnv('ENV', 'dev'), // dev, prod 
    'app_name': getEnv('APP_NAME', 'Member Tools'),
    'base_url': getEnv('BASE_URL', ''),

    'cron_enabled': getEnv('CRON_ENABLED') == 'true' ? true : false,

    'debug': getEnv('DEBUG', false),
    'debug_database': getEnv('DB_DEBUG', false),

    'port': getEnv('PORT', '8080'),
    'instance': getEnv('INSTANCE', 'dev-001')
}