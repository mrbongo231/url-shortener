# URL Shortener

URL shortener built on Vercel with serverless functions.


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


