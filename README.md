# Cloud Computing LAB 3 & 4 — Student API

This repository covers:

- **LAB 3:** GitHub Actions builds the Docker image and pushes it to GitHub Container Registry (GHCR).
- **LAB 4:** Render deploys the Dockerfile; MongoDB Atlas stores student data.

## API

- `GET /` — service information
- `GET /health` — database connection health check
- `GET /api/students` — list students
- `POST /api/students` — create a student

Example request body:

```json
{
  "studentId": "22D480001",
  "fullName": "Nguyen Van A",
  "classCode": "CNTT-K46"
}
```

## Deploy on Render

1. Create a free MongoDB Atlas cluster and database user. Add a network access rule for Render; `0.0.0.0/0` is convenient for this lab but is not suitable for a production database.
2. Create a **Web Service** in Render, connect this GitHub repository, and choose **Docker** as the runtime. Render automatically detects the `Dockerfile`.
3. Add the `DATABASE_URL` Environment Variable in Render. Use your real Atlas connection string; do not commit it to GitHub.
4. Deploy and test `https://<your-render-service>.onrender.com/health`.

## Local run (optional)

No local Docker or virtual machine is required for the lab. If you do run it locally, copy `.env.example` to `.env`, set `DATABASE_URL`, then run:

```bash
npm install
npm start
```

The GitHub Actions workflow runs the Docker build remotely and pushes the image to `ghcr.io/<owner>/<repository>:latest`.
