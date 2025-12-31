# URL Shortener

A fast, free URL shortener built on Vercel with serverless functions.

## Features

- ⚡ **Fast** - Serverless functions on Vercel's edge network
- 🔗 **Short URLs** - Generate 6-character random slugs
- ✏️ **Custom Slugs** - Use your own custom slugs
- 📊 **Click Tracking** - Basic analytics for each link
- 🎨 **Modern UI** - Beautiful, responsive interface

## Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Vercel KV Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create** → **KV**
3. Name it `url-shortener-kv`
4. Connect it to your project

### 4. Local Development

```bash
vercel dev
```

This starts a local development server at `http://localhost:3000`.

### 5. Deploy

```bash
vercel --prod
```

Or just push to your connected GitHub repo!

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
  "shortUrl": "https://your-app.vercel.app/abc123",
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
├── api/
│   ├── shorten.js    # Create short URLs
│   ├── stats.js      # Get URL statistics
│   └── [slug].js     # Handle redirects
├── public/
│   ├── index.html    # Frontend HTML
│   ├── styles.css    # CSS styles
│   └── app.js        # Frontend JavaScript
├── vercel.json       # Vercel configuration
└── package.json      # Dependencies
```

## Free Tier Limits

Vercel free tier includes:
- 100GB bandwidth/month
- Serverless function executions
- Vercel KV (limited reads/writes)

Perfect for personal URL shorteners!
