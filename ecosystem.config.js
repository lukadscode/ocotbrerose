module.exports = {
  apps: [
    {
      name: "octobre-rose-2025",
      script: "server.js",
      cwd: "/var/www/octobrerose",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
        RESEND_API_KEY: "votre_cle_resend_ici",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "/var/log/pm2/octobre-rose-error.log",
      out_file: "/var/log/pm2/octobre-rose-out.log",
      log_file: "/var/log/pm2/octobre-rose-combined.log",
    },
  ],
};
