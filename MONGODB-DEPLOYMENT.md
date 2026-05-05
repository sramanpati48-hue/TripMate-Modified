# MongoDB Atlas Cloud Deployment Guide

## ✅ Status: MongoDB Ready

Your travel app is now fully configured to use **MongoDB Atlas**. Follow this guide to deploy your database to the cloud.

---

## Step 1: Create MongoDB Atlas Account (Free)

### Sign Up
1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. Click **"Try Free"** or **"Sign Up"**
3. Choose signup method:
   - Email/Password
   - Google
   - GitHub
   - Microsoft

### Verify Email
- Check your email for verification link
- Click link to verify your account
- Create an organization (name it "Travel App")

---

## Step 2: Create a Free Cluster

### Create Cluster
1. After signing in, click **"+ Create"** button
2. Select **"Build a Cluster"** 
3. Choose your plan:
   - **Select "Free"** tier ✓
   - Click **"Create"**

### Configure Cluster
1. **Cloud Provider**: AWS (recommended, any is fine)
2. **Region**: Choose closest to your users
   - US East (N. Virginia) - `us-east-1`
   - Europe (Frankfurt) - `eu-central-1`
   - Asia Pacific (Singapore) - `ap-southeast-1`
3. Click **"Create Cluster"**
4. ⏳ Wait 2-5 minutes for cluster to initialize

---

## Step 3: Create Database Credentials

### Add Database User
1. In left sidebar, click **"Database Access"**
2. Click **"+ Add New Database User"** button
3. Fill in credentials:
   ```
   Username:     travel_admin
   Password:     CreateStrongPassword!123
   Role:         Built-in Role → readWriteAnyDatabase
   ```
4. Click **"Add User"** button

### ⚠️ Save Your Credentials
```
Username: travel_admin
Password: CreateStrongPassword!123
```
Keep these safe! You'll need them for the connection string.

---

## Step 4: Get Connection String

### Access Connection String
1. Go to **"Clusters"** page (left sidebar)
2. Click **"Connect"** button on your cluster
3. Select **"Drivers"** tab (not Shell)
4. Choose **"Node.js"** as driver
5. Copy the connection string (looks like below)

### Format
```
mongodb+srv://travel_admin:CreateStrongPassword!123@travel-app-xyz.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ Replace:**
- `CreateStrongPassword!123` → Your actual password
- If password has special chars: Use URL encoding
  - `@` → `%40`
  - `#` → `%23`
  - `!` → `%21`

---

## Step 5: Allow Network Access

### Add IP Whitelist
1. Go to **"Network Access"** (left sidebar)
2. Click **"+ Add IP Address"** button
3. Choose one option:
   - **Option A (Development)**: "Allow Access from Anywhere" (0.0.0.0/0)
   - **Option B (Production)**: Enter specific IPs

4. Click **"Confirm"**

### Allowed Locations
- ✅ Local development: Any IP (0.0.0.0/0)
- ✅ Vercel: No IP whitelist needed (auto-allowed)
- ✅ Other hosting: Add server IP

---

## Step 6: Update Environment Variables

### Update .env.local
Open `.env.local` and update:

```env
# Database (MongoDB Atlas)
DATABASE_URL="mongodb+srv://travel_admin:CreateStrongPassword!123@travel-app-xyz.mongodb.net/travel-app?retryWrites=true&w=majority"

# Rest of your config...
```

### For .env.production (Production)
Same as .env.local - Prisma will use DATABASE_URL from environment.

---

## Step 7: Initialize Database Schema

### Create Collections
Run this command to create all database collections:

```bash
npx prisma db push
```

### Expected Output
```
✔ Your database has been successfully provisioned!

✔ 10 new tables created:
  - User
  - Account
  - Session
  - VerificationToken
  - Trip
  - Favorite
  - Review
  - Booking
  - TravelProfile
  - TravelMatchRequest
```

### If Errors Occur
```bash
# Reset database (development only!)
npx prisma db push --force-reset

# Or view schema changes
npx prisma db push --dry-run
```

---

## Step 8: Test MongoDB Connection

### Start Development Server
```bash
npm run dev
```

### Test Features
1. **Register Account** → Data saved to MongoDB ✓
2. **Create Trip** → Persisted across page reloads ✓
3. **Add Favorite** → Visible after refresh ✓
4. **Create Match Request** → Retrieved from database ✓

### Verify in MongoDB
1. Go back to MongoDB Atlas
2. Click **"Databases"** 
3. Select your cluster
4. Browse collections and view documents

---

## Production Deployment

### Before Deployment
- [ ] Update DATABASE_URL in hosting environment
- [ ] Configure MongoDB IP whitelist (or use 0.0.0.0/0)
- [ ] Run `npm run build` locally to test
- [ ] Consider MongoDB paid tier for backups

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
# Add: DATABASE_URL = your_connection_string
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up

# Add DATABASE_URL in Railway dashboard
```

#### Other Platforms
1. Set `DATABASE_URL` env variable
2. Ensure Prisma is generated: `npx prisma generate`
3. Run migration: `npx prisma db push`

---

## Troubleshooting

### Connection Refused
- **Check**: Is MongoDB cluster running? (green status in Atlas)
- **Check**: IP whitelist includes your IP
- **Fix**: In Network Access, add "0.0.0.0/0"

### Authentication Failed
```
MongoServerSelectionError: Server selection failed
```
- **Check**: Username and password are correct
- **Check**: Password doesn't contain URL-special characters
- **Fix**: Reset user password in Database Access

### Connection String Format
```
❌ WRONG: mongodb://user:pass@localhost:27017
✅ RIGHT: mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Database Not Created
```bash
# If collections don't exist:
npx prisma db push

# If schema conflicts:
npx prisma db push --force-reset
```

### Timeout Issues
- MongoDB free tier can timeout with high traffic
- Consider upgrading to paid tier for production
- Add connection pooling: `?retryWrites=true&w=majority&maxPoolSize=10`

---

## Monitoring & Maintenance

### View Database Metrics
1. MongoDB Atlas Dashboard → Clusters
2. Click cluster name
3. View:
   - **Storage used** (free tier: 512 MB limit)
   - **Network traffic**
   - **Connections**

### Backup Data
```bash
# Export data
npx prisma db pull > backup.sql

# Create seed file
npx prisma db seed
```

### Upgrade Later
Free tier includes:
- ✓ 512 MB storage
- ✓ Shared infrastructure
- ✓ No automatic backups
- ✓ No SLA

Upgrade to Paid when you need:
- ✗ More storage
- ✗ Automatic backups
- ✗ Production SLA

---

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (Your Travel   │
│     App)        │
└────────┬────────┘
         │
         │ Prisma ORM
         │
┌────────▼────────┐
│  Prisma Client  │
└────────┬────────┘
         │
         │ TCP Connection
         │
┌────────▼──────────────────┐
│   MongoDB Atlas Cloud      │
│  (Free Cluster)            │
│  ├─ User Collection        │
│  ├─ Trip Collection        │
│  ├─ Favorite Collection    │
│  ├─ Review Collection      │
│  ├─ Booking Collection     │
│  └─ [Other Collections]    │
└─────────────────────────────┘
```

---

## Free Tier Limits & Migration Path

| Feature | Free | Paid | When to Upgrade |
|---------|------|------|-----------------|
| Storage | 512 MB | 10+ GB | App > 100MB data |
| Backups | None | Daily | Production launch |
| SLA | None | 99.99% | Requires uptime |
| Support | Community | Premium | Enterprise |
| Auto-scaling | No | Yes | Traffic spikes |

---

## Next Steps

1. ✅ **Database**: MongoDB Atlas (Deployed)
2. ⏭️ **Deploy App**: Vercel / Railway / Railway
3. ⏭️ **Setup Backups**: MongoDB automatic backups
4. ⏭️ **Monitor**: Use MongoDB Atlas dashboard

---

## Need Help?

- **MongoDB Docs**: https://docs.mongodb.com/manual/
- **Prisma MongoDB**: https://www.prisma.io/docs/orm/overview/databases/mongodb
- **MongoDB Atlas Support**: https://support.mongodb.com/
- **Prisma Discord**: https://discord.prisma.io/

---

**Your app is now ready for cloud deployment!** 🚀
