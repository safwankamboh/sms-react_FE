# SMS React frontend

Separate React interface for the Laravel School Management System.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173` in a browser. The Laravel API URL is configured in `.env`:

```env
VITE_API_BASE_URL=http://sms.test/api/v1
```

## Quality checks

```bash
npm run lint
npm run build
```

Business modules are added one at a time after confirming their Laravel API contracts.
