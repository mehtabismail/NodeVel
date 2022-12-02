/**
 * Email configurations
 */
module.exports = {
    'email_client': getEnv('EMAIL_CLIENT', 'smtp'),
    'email_host': getEnv('EMAIL_HOST', 'smtp.mailtrap.io'),
    'email_port': getEnv('EMAIL_PORT', 2525),
    'email_username': getEnv('EMAIL_USERNAME', '23956860cddaae'),
    'email_password': getEnv('EMAIL_PASSWORD', '6b62e2b4e977ad'),
    'email_sender': getEnv('EMAIL_SENDER', 'no-reply@aawhina.com'),
    'email_sender_name': getEnv('EMAIL_SENDER_NAME', 'Aawhina')
}