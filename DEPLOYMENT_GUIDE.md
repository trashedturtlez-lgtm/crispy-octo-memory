# Digital Product Distributor - Complete Setup & Deployment Guide

## Project Overview

The Digital Product Distributor is a full-stack web application that allows creators to upload digital products once and distribute them across multiple platforms (Gumroad, Etsy, Shopify, LemonSqueezy) with automated pricing, marketing, and distribution management.

### Tech Stack
- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend:** Express 4 + tRPC 11 + Node.js
- **Database:** MySQL/TiDB
- **Authentication:** OAuth 2.0 (Manus or custom)
- **Storage:** S3-compatible storage for file uploads

---

## Local Development Setup

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+ (or npm/yarn)
- MySQL 8.0+ (or compatible database)

### Installation Steps

1. **Extract the project**
   ```bash
   tar -xzf digital_product_distributor.tar.gz
   cd digital_product_distributor
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the project root:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@localhost:3306/digital_product_distributor
   
   # Authentication (if using OAuth)
   VITE_APP_ID=your_oauth_app_id
   OAUTH_SERVER_URL=https://oauth.example.com
   VITE_OAUTH_PORTAL_URL=https://oauth.example.com/login
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this
   
   # Storage (S3-compatible)
   AWS_ACCESS_KEY_ID=your_s3_access_key
   AWS_SECRET_ACCESS_KEY=your_s3_secret_key
   AWS_S3_BUCKET=your_bucket_name
   AWS_REGION=us-east-1
   
   # Owner Info
   OWNER_NAME=Your Name
   OWNER_OPEN_ID=unique_owner_id
   
   # LLM Integration (for description generation)
   OPENAI_API_KEY=your_openai_key (optional)
   ```

4. **Set up database**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE digital_product_distributor;"
   
   # Run migrations
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```
   
   Server runs on `http://localhost:3000`

6. **Run tests**
   ```bash
   pnpm test
   ```

---

## Project Structure

```
digital_product_distributor/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (Products, Assets, Distribution, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Theme, Auth)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities (tRPC client, etc.)
│   │   ├── App.tsx           # Main app router
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   └── index.html
├── server/                    # Node.js/Express backend
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   ├── products.test.ts      # Unit tests
│   ├── _core/                # Framework internals
│   │   ├── index.ts          # Express server setup
│   │   ├── context.ts        # tRPC context
│   │   ├── trpc.ts           # tRPC router setup
│   │   ├── auth.ts           # Authentication logic
│   │   ├── llm.ts            # LLM integration
│   │   ├── env.ts            # Environment variables
│   │   └── ...
│   └── storage.ts            # S3 storage helpers
├── drizzle/                   # Database schema & migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # SQL migration files
├── shared/                    # Shared types & constants
├── package.json
├── tsconfig.json
├── vite.config.ts
└── drizzle.config.ts
```

---

## Key Features

### 1. Product Management
- Create and manage digital products
- Upload product files (PDFs, ZIPs, etc.)
- Add product metadata (name, description, category)
- Track product status (draft, ready, distributed)

### 2. Visual Asset Management
- Upload product images and promotional graphics
- Organize assets by type (thumbnail, preview, promotional)
- Support for PNG, JPG, GIF formats

### 3. Multi-Platform Distribution
- Select target platforms (Gumroad, Etsy, Shopify, LemonSqueezy)
- Configure platform-specific settings
- Track distribution status in real-time

### 4. Pricing Configuration
- Set base price for products
- Configure platform-specific pricing
- Automatic currency conversion support
- Account for platform fees

### 5. Marketing Automation
- Generate social media posts for Twitter/X, LinkedIn, Facebook
- Add hashtags and mentions
- Preview posts before publishing
- Copy to clipboard for easy sharing

### 6. Distribution Tracking
- Real-time sync status across platforms
- Distribution history and logs
- Error tracking and reporting

---

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Cost:** $5/month free trial, then ~$5-20/month

1. **Create Railway account**
   - Go to railway.app
   - Sign up with GitHub

2. **Connect your repository**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository

3. **Configure environment**
   - Add environment variables in Railway dashboard
   - Set `DATABASE_URL` to Railway PostgreSQL
   - Add all secrets from `.env.local`

4. **Deploy**
   - Railway auto-deploys on push to main branch
   - View logs in dashboard

### Option 2: Vercel (Frontend) + Railway (Backend)

**Cost:** Free tier + $5-20/month for backend

1. **Deploy backend on Railway** (see Option 1)

2. **Deploy frontend on Vercel**
   - Go to vercel.com
   - Import GitHub repository
   - Set build command: `pnpm build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-railway-backend.railway.app`

### Option 3: Render (Full-stack)

**Cost:** Free tier (with limitations) or $7+/month

1. **Create Render account**
   - Go to render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Set build command: `pnpm build`
   - Set start command: `pnpm start`

3. **Add PostgreSQL database**
   - Click "New +" → "PostgreSQL"
   - Connect to web service

4. **Configure environment variables**
   - Add all secrets from `.env.local`
   - Set `DATABASE_URL` to Render PostgreSQL connection string

### Option 4: Docker + Any Cloud Provider

**Create Dockerfile:**
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

**Deploy to:**
- AWS EC2 / ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## Database Setup

### Using MySQL Locally

```bash
# Create database
mysql -u root -p
CREATE DATABASE digital_product_distributor;
USE digital_product_distributor;

# Run migrations
pnpm db:push
```

### Using Cloud Databases

**Railway PostgreSQL:**
- Automatically created when you add PostgreSQL to Railway
- Connection string provided in environment

**Supabase (Free PostgreSQL):**
- Go to supabase.com
- Create new project
- Copy connection string to `DATABASE_URL`

**PlanetScale (Free MySQL):**
- Go to planetscale.com
- Create new database
- Copy connection string to `DATABASE_URL`

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host/db` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key-min-32-chars` |
| `VITE_APP_ID` | OAuth application ID | `app_123456` |
| `OAUTH_SERVER_URL` | OAuth server base URL | `https://oauth.example.com` |
| `VITE_OAUTH_PORTAL_URL` | OAuth login portal URL | `https://oauth.example.com/login` |
| `AWS_ACCESS_KEY_ID` | S3 access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key | `wJal...` |
| `AWS_S3_BUCKET` | S3 bucket name | `my-bucket` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `OWNER_NAME` | Application owner name | `Your Name` |
| `OWNER_OPEN_ID` | Unique owner identifier | `owner_123` |

---

## API Documentation

### Core Endpoints

All endpoints use tRPC and are accessed via `/api/trpc`

**Products:**
- `products.list` - Get all products for user
- `products.get` - Get single product
- `products.create` - Create new product
- `products.update` - Update product
- `products.delete` - Delete product

**Assets:**
- `assets.list` - Get product assets
- `assets.create` - Upload asset

**Platforms:**
- `platforms.getConfigs` - Get platform configurations
- `platforms.updateConfig` - Update platform settings

**Pricing:**
- `pricing.get` - Get product pricing
- `pricing.update` - Update pricing

**Marketing:**
- `marketing.list` - Get marketing content
- `marketing.create` - Create marketing post

**Distribution:**
- `distribution.history` - Get distribution history
- `distribution.record` - Record distribution event

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
mysql -u user -p -h host -e "SELECT 1;"

# Check DATABASE_URL format
# MySQL: mysql://user:password@host:3306/database
# PostgreSQL: postgresql://user:password@host:5432/database
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

### Database Migration Issues
```bash
# Generate new migration
pnpm drizzle-kit generate

# Check migration status
pnpm drizzle-kit migrate
```

---

## Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with Vite
- CSS purging with Tailwind
- Lazy loading for routes

### Backend
- Database query optimization with Drizzle ORM
- Connection pooling for database
- Caching strategies for frequently accessed data
- Compression middleware

### Deployment
- Enable gzip compression
- Use CDN for static assets
- Set appropriate cache headers
- Monitor performance with tools like Vercel Analytics

---

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate secrets regularly

2. **Authentication**
   - Implement rate limiting on auth endpoints
   - Use secure session cookies (httpOnly, secure, sameSite)
   - Validate JWT tokens on every request

3. **Database**
   - Use parameterized queries (Drizzle ORM does this)
   - Implement row-level security
   - Regular backups

4. **File Uploads**
   - Validate file types
   - Scan for malware
   - Store in S3 with restricted access

5. **API Security**
   - Implement CORS properly
   - Rate limiting
   - Input validation
   - SQL injection prevention (handled by Drizzle)

---

## Testing

### Run All Tests
```bash
pnpm test
```

### Run Specific Test File
```bash
pnpm test server/products.test.ts
```

### Watch Mode
```bash
pnpm test -- --watch
```

### Coverage Report
```bash
pnpm test -- --coverage
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates installed
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Database indexes optimized
- [ ] CDN configured for static assets
- [ ] Automated deployments set up
- [ ] Monitoring and alerting configured
- [ ] Disaster recovery plan in place

---

## Support & Resources

- **Documentation:** See inline code comments and README files
- **tRPC Docs:** https://trpc.io
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Drizzle ORM:** https://orm.drizzle.team

---

## License

This project is provided as-is for your use.

---

## Next Steps

1. Extract the project archive
2. Follow the "Local Development Setup" section
3. Choose a deployment platform from the options above
4. Deploy and start selling!

For questions or issues, refer to the troubleshooting section or check the inline code documentation.
