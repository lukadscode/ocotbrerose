module.exports = {
  apps: [
    {
      name: "octobre-rose-2025",
      cwd: "/var/www/octobrerose",
      script: "npm",
      args: "run preview -- --host 0.0.0.0 --port 4173",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
