# Folio

A self-hosted photography portfolio with an Unsplash-style profile page, collection management, and a clean admin panel.

## Features

- **Unsplash-style homepage** - Profile header, interest tags, Photos/Collections tabs
- **Collection cards** - Preview grid with cover images, click to browse
- **Lightbox** - Full-screen photo viewer with keyboard navigation (Arrow keys, Esc)
- **Admin panel** - Upload photos, manage collections, edit metadata, reorder photos
- **Dark/Light mode** - Toggle between themes, persisted in localStorage
- **i18n** - Chinese/English UI toggle
- **Photo metadata** - Title, description, location, date, camera, author note, custom fields
- **Backup system** - Deleted photos are backed up to `/backup/` before removal
- **Server-side auth** - Password-protected admin with HMAC-signed cookies

## Quick Start

```bash
# Clone
git clone https://github.com/Cindy-Master/folio.git
cd folio

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local and set your admin password

# Run
npm run dev
```

Open http://localhost:3000 to view the site.

Open http://localhost:3000/admin/login to access the admin panel.

## Configuration

Create a `.env.local` file in the project root:

```env
ADMIN_PASSWORD=your_password_here
```

Default password is `admin123` if not configured (change this before deploying).

## Project Structure

```
folio/
├── data/
│   ├── profile.json          # Your profile info
│   └── collections.json      # Collections and photo data
├── public/photos/
│   ├── avatar.jpg             # Profile avatar
│   └── collections/           # Photo files organized by collection
├── pages/
│   ├── index.js               # Homepage (Unsplash-style)
│   ├── collections/[slug].js  # Collection detail + Lightbox
│   ├── admin/
│   │   ├── login.js           # Admin login
│   │   └── index.js           # Admin dashboard
│   └── api/                   # Backend API routes
├── lib/
│   ├── auth.js                # HMAC cookie authentication
│   ├── data.js                # JSON file read/write operations
│   ├── i18n.js                # Translation strings
│   └── useSettings.js         # Theme and locale hook
├── backup/                    # Auto-backup of deleted photos
└── styles/
    └── globals.css            # Global styles + animations
```

## Admin Panel

Access at `/admin/login` with your configured password.

**Collections Management:**
- Create collections with title, slug, description, location, date, and custom fields
- Upload multiple photos at once (supported: jpg, png, gif, webp, avif)
- Edit photo metadata: title, description, location, date, camera/lens, author note
- Add unlimited custom key-value fields to both collections and photos
- Reorder photos with up/down buttons (first photo becomes the collection cover)
- Delete photos (auto-backed up to `/backup/`)

**Profile Editor:**
- Name, signature quote, bio, email, location, website, interest tags
- Upload avatar image

## Deployment

### Prerequisites

- Node.js 18+
- A reverse proxy (Caddy/Nginx) for HTTPS

### Steps

```bash
# On your server
git clone https://github.com/Cindy-Master/folio.git /opt/folio
cd /opt/folio

# Install and build
npm install
echo 'ADMIN_PASSWORD=your_secure_password' > .env.local
npm run build

# Start with PM2
npm install -g pm2
PORT=3001 pm2 start npm --name folio -- start
pm2 save
pm2 startup
```

### Caddy Configuration

Since Next.js in production mode doesn't serve dynamically uploaded files from `public/`, configure your reverse proxy to serve photos directly from the filesystem:

```caddyfile
yourdomain.com {
    handle /photos/* {
        root * /opt/folio/public
        file_server
    }

    handle {
        reverse_proxy localhost:3001
    }
}
```

### Nginx Alternative

```nginx
server {
    server_name yourdomain.com;

    location /photos/ {
        alias /opt/folio/public/photos/;
    }

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## API Reference

All write endpoints require authentication via cookie.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login with password |
| POST | `/api/logout` | Clear session |
| GET | `/api/auth-check` | Check auth status |
| GET | `/api/profile` | Get profile data |
| PUT | `/api/profile` | Update profile |
| POST | `/api/avatar` | Upload avatar |
| GET | `/api/collections` | List all collections |
| POST | `/api/collections` | Create collection |
| PUT | `/api/collections` | Update collection |
| DELETE | `/api/collections` | Delete collection |
| PUT | `/api/photos` | Update photo metadata / reorder |
| DELETE | `/api/photos` | Delete photo |
| POST | `/api/upload` | Upload photos to collection |

## Tech Stack

- **Next.js 15** - React framework with SSR
- **Tailwind CSS 4** - Utility-first styling
- **JSON file storage** - No database required

## License

MIT
