module.exports = {
    'default': 'dev',
    'dev': {
        'driver': getEnv('DB', 'mongo'),
        'host': getEnv('DB_HOST', 'mongo'),
        'port': getEnv('DB_PORT', '27017'),
        'name': getEnv('DB_NAME', 'aawhina'),
        'username': getEnv('DB_USERNAME', 'root'),
        'password': getEnv('DB_PASSWORD', 'root'),
        'auth': getEnv('DB_AUTH', 'DEFAULT'),
        'ssl': getEnv('DB_SECURE', false),
    },
    'mysql': {
        'driver': getEnv('MYSQL_DB', 'mysql'),
        'host': getEnv('MYSQL_HOST', 'mysql'),
        'port': getEnv('MYSQL_PORT', 3306),
        'name': getEnv('MYSQL_NAME', 'my_db'),
        'username': getEnv('MYSQL_USERNAME', 'root'),
        'password': getEnv('MYSQL_PASSWORD', 'root')
    }
}