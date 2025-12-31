# URL Shortener

A fast, free URL shortener built on Cloudflare Workers with KV storage.

## Features

- ⚡ **Fast** - Edge-deployed globally via Cloudflare Workers
- 🔗 **Short URLs** - Generate 6-character random slugs
- ✏️ **Custom Slugs** - Use your own custom slugs
- 📊 **Click Tracking** - Basic analytics for each link
- 🎨 **Modern UI** - Beautiful, responsive interface

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create KV Namespace

```bash
npm run kv:create
```

This will output something like:
```
🌀 Creating namespace "URLS"
✨ Success! Created namespace "URLS" with ID "abc123..."
```

### 3. Update wrangler.toml

Replace `YOUR_KV_NAMESPACE_ID` in `wrangler.toml` with the ID from the previous step.

### 4. Local Development

```bash
npm run dev
```

This starts a local development server at `http://localhost:8787`.

### 5. Deploy

```bash
npm run deploy
```

## API Endpoints

### POST /api/shorten

Create a short URL.

**Request:**
```json
{
  "url": "https://example.com/very-long-url",
  "customSlug": "optional-custom-slug"
}
```

**Response:**
```json
{
  "success": true,
  "shortUrl": "https://your-worker.workers.dev/abc123",
  "slug": "abc123",
  "originalUrl": "https://example.com/very-long-url"
}
```

### GET /api/stats

Get statistics for all shortened URLs.

### GET /:slug

Redirects to the original URL.

## Project Structure

```
url-shortener/
├── src/
│   └── index.js      # Main Worker code with embedded frontend
├── wrangler.toml     # Cloudflare Workers configuration
├── package.json      # Project dependencies
└── README.md         # This file
```

## Free Tier Limits

Cloudflare Workers free tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- 1GB KV storage

Perfect for personal URL shorteners!
# url-shortener
