# Nexora production deployment

## Render deployment

1. Push this project to a GitHub repository.
2. In Render, choose **New > Blueprint** and select the repository.
3. Render will read `render.yaml`, create the Node web service, and attach a 1 GB persistent disk at `/var/data`.
4. Confirm the generated `ADMIN_KEY` environment variable is present. Keep it private; it unlocks product and dashboard administration.
5. After the first deploy, open the generated `https://...onrender.com` URL. The app and API are served from the same origin.
6. Check `https://...onrender.com/healthz`; it should return `{"status":"ok"}`.

The SQLite database is created and seeded on the persistent disk using `DATABASE_PATH=/var/data/nexora.sqlite`. Do not remove or recreate the disk during a redeploy, otherwise production data will be lost.

## Local production check

Set `ADMIN_KEY` and start the server:

```powershell
$env:ADMIN_KEY = "use-a-long-random-secret"
$env:NODE_ENV = "production"
npm ci
npm start
```

Then open `http://localhost:3000`.
