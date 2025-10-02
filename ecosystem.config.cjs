module.exports = {
  apps: [
    {
      name: "octobre-rose-2025",
      cwd: "/var/www/octobre-rose",
      script: "server.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
      error_file: "/var/www/octobre-rose/logs/pm2-error.log",
      out_file: "/var/www/octobre-rose/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
