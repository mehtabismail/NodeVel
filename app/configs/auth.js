/**
 * Authentication and security configurations
 */
 module.exports = {
    'token': getEnv('TOKEN', 'idWKE!2keySECRE&7oken'),
    'token_expiry': getEnv('TOKEN_EXPIRY', 3600 * 24 * 7 * 4), // 1month
    'refresh_token': getEnv('REFRESH_TOKEN', 'idWKE!2keySECRE&7oken'),    
    'salt_bytes': getEnv('SALT_BYTES', 64),
    'hash_algo': getEnv('HASH_ALGO', 'sha512'),
    'hash_iterations': getEnv('HASH_ITERATIONS', 10000),
    'salt': getEnv('SALT', 'sVlGLNRXvxvMXH69ScC3FI1dphWAjUjuHz8icY2frap/UGscnDt402Lraz+H3fulsSx/sxO24QQfdEzknxgIyg=='),
}