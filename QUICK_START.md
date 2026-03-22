# Digital Product Distributor - Quick Start Guide

## 5-Minute Setup

### 1. Extract & Install
```bash
tar -xzf digital_product_distributor.tar.gz
cd digital_product_distributor
pnpm install
```

### 2. Configure Database
```bash
# Create .env.local file with:
DATABASE_URL=mysql://root:password@localhost:3306/digital_product_distributor
JWT_SECRET=your_secret_key_here_change_this_in_production
```

### 3. Run Migrations
```bash
pnpm db:push
```

### 4. Start Development
```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## What You Get

✅ **Complete Product Management System**
- Upload digital products
- Manage images and assets
- Track product status

✅ **Multi-Platform Distribution**
- Gumroad integration
- Etsy integration
- Shopify integration
- LemonSqueezy integration

✅ **Marketing Tools**
- Social media post generator
- Twitter/X, LinkedIn, Facebook support
- Hashtag and mention management

✅ **Pricing Management**
- Platform-specific pricing
- Currency conversion
- Price tracking

✅ **Professional Dashboard**
- Elegant UI with sidebar navigation
- Real-time status updates
- Distribution tracking

---

## Deploy in 10 Minutes

### Option A: Railway (Easiest)
1. Go to railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Done! Auto-deploys on push

### Option B: Vercel (Frontend Only)
1. Go to vercel.com
2. Import your repository
3. Set build: `pnpm build`
4. Set output: `dist`
5. Deploy!

### Option C: Render (Full Stack)
1. Go to render.com
2. Create Web Service from GitHub
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy!

---

## File Structure

```
digital_product_distributor/
├── client/          # React frontend
├── server/          # Node.js backend
├── drizzle/         # Database schema
├── shared/          # Shared types
└── package.json
```

---

## Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Run migrations
pnpm drizzle-kit generate  # Generate new migration

# Testing
pnpm test             # Run tests
pnpm test -- --watch  # Watch mode

# Code Quality
pnpm format           # Format code
pnpm check            # Type check
```

---

## Key Features

### 📦 Product Management
- Create and upload digital products
- Organize by category
- Track distribution status

### 🎨 Visual Assets
- Upload product images
- Manage thumbnails and previews
- Promotional graphics

### 🌐 Multi-Platform
- Distribute to 4+ platforms simultaneously
- Platform-specific formatting
- Automatic sync

### 💰 Pricing
- Set base price
- Platform-specific pricing rules
- Currency conversion

### 📱 Marketing
- Generate social media posts
- Multi-platform support
- Copy-to-clipboard functionality

### 📊 Analytics
- Distribution status tracking
- Real-time sync updates
- Error logging

---

## Environment Variables

Create `.env.local`:

```env
# Required
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_SECRET=your_secret_key_min_32_chars

# Optional (for OAuth)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://oauth.example.com
VITE_OAUTH_PORTAL_URL=https://oauth.example.com/login

# Optional (for S3 storage)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
AWS_REGION=us-east-1
```

---

## Troubleshooting

**Port 3000 already in use?**
```bash
lsof -i :3000
kill -9 <PID>
```

**Database connection error?**
- Check DATABASE_URL format
- Verify MySQL is running
- Ensure database exists

**Build errors?**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

---

## Next Steps

1. ✅ Extract and install
2. ✅ Set up database
3. ✅ Start development server
4. ✅ Create your first product
5. ✅ Configure platforms
6. ✅ Deploy to production

---

## Support

- Check DEPLOYMENT_GUIDE.md for detailed setup
- Review inline code comments
- Check test files for usage examples
- Visit framework documentation:
  - React: https://react.dev
  - tRPC: https://trpc.io
  - Tailwind: https://tailwindcss.com

---

## Ready to Launch?

You now have a complete, production-ready digital product distribution platform. 

Start with local development, then deploy to your chosen platform. Good luck! 🚀
