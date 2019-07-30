module.exports = {
  apps: [
    {
      name: 'development_platform_server',
      script: 'bin/www',
      instances: 1,
      autorestart: true,
      watch: true,
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
