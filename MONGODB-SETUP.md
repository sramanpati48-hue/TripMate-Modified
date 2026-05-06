# MongoDB Atlas Setup Guide

Your travel app has been successfully migrated from SQLite to **MongoDB Atlas** (Free Tier). Follow these steps to get it running:

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** (or "Sign In" if you have an account)
3. Create a free account with email/password or use Google/GitHub SSO

## Step 2: Create a Free Cluster

1. After signing in, click **"Create"** to create a new project
2. Name your project (e.g., "Travel App")
3. Select **"Create a Free Cluster"**
4. Choose:
   - **Cloud Provider**: AWS/Google Cloud/Azure (any works)
   - **Region**: Choose closest to your location (e.g., `us-east-1`)
5. Wait 2-5 minutes for cluster creation to complete

## Step 3: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Set credentials:
   - **Username**: `travel_user` (or any name)
   - **Password**: Create a strong password (copy it!)
   - **Role**: `Built-in role > readWriteAnyDatabase`
4. Click **"Add User"**

## Step 4: Get Connection String

1. Go to **"Clusters"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"** (not Shell)
4. Choose **Node.js** driver
5. Copy the connection string that looks like:
   ```
   mongodb+srv://travel_user:PASSWORD@cluster-name.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 5: Update Environment Variables

1. Open `.env.local` in your project
2. Replace the DATABASE_URL with your connection string:
   ```
   DATABASE_URL="mongodb+srv://travel_user:YOUR_PASSWORD@cluster-name.mongodb.net/travel-app?retryWrites=true&w=majority"
   ```
   
3. Replace `YOUR_PASSWORD` with your actual password
4. Replace `cluster-name` with your actual cluster name

Example:
```
DATABASE_URL="mongodb+srv://travel_user:MySecurePass123@my-cluster.mongodb.net/travel-app?retryWrites=true&w=majority"
```

## Step 6: Allow Network Access

1. In MongoDB Atlas, go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development)
   - For production, specify your server IP
4. Click **"Confirm"**

## Step 7: Create Database Collections

Run the Prisma push command to create all collections:

```bash
npx prisma db push
```

This will:
- Create all database collections (User, Trip, Favorite, etc.)
- Set up indexes for better performance
- Ready your MongoDB for data

## Step 8: Test Connection

Start your dev server:

```bash
npm run dev
```

Visit `http://localhost:3001` and try:
1. Creating an account (register)
2. Adding favorites
3. Creating a trip

If data persists after refresh, your MongoDB is connected! ✅

## Troubleshooting

### Connection String Issues
- Make sure password has no special characters (or URL-encode them: `@` → `%40`)
- Username/password must match what you created
- Check cluster name is correct

### "Permission Denied" Errors
- Go to Network Access and verify your IP is whitelisted
- Try "Allow Access from Anywhere" for development

### "Authentication Failed"
- Verify database user exists in "Database Access"
- Check password is correct
- Try recreating the user with a simpler password

### Prisma Push Fails
- Ensure DATABASE_URL is valid
- Check MongoDB connectivity
- Try: `npx prisma db push --force-reset` (only in development!)

## Free Tier Limits

MongoDB Atlas Free Tier includes:
- **512 MB storage** (generous for most apps)
- **Shared cluster** (not dedicated)
- **No backup** (manual exports needed)
- **512 connections max**

Upgrade to Paid tier when you:
- Need more than 512 MB storage
- Deploy to production
- Require automatic backups

## Backing Up Your Data

To export your data:

```bash
npx prisma db dump
```

To seed new data:

```bash
npx prisma db seed
```

## Production Deployment

When deploying to production (Vercel, Railway, etc.):

1. Add DATABASE_URL to hosting platform's environment variables
2. Run: `npm run build`
3. Ensure your MongoDB IP whitelist includes your server IP
4. Consider upgrading to paid MongoDB tier for production

## Comparison: SQLite → MongoDB

| Feature | SQLite (Old) | MongoDB Atlas (New) |
|---------|-------------|-------------------|
| Storage | Local file | Cloud hosted |
| Scalability | Limited | Excellent |
| Backups | Manual | Automatic (paid) |
| Access | Local only | Global |
| Cost | Free | Free (512MB) |
| Setup | None | 10 minutes |

---

**Questions?** Check [Prisma MongoDB docs](https://www.prisma.io/docs/orm/overview/databases/mongodb) or [MongoDB Atlas help](https://docs.mongodb.com/atlas/)
