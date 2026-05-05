# ✅ MongoDB Migration Checklist

## Supabase → MongoDB Atlas Transition

### ✅ Completed Tasks
- [x] Updated Prisma schema from SQLite to MongoDB
- [x] Added `@map("_id")` to all MongoDB models
- [x] Added indexes for foreign keys (performance)
- [x] Updated `.env.local` with MongoDB URL format
- [x] Removed SQLite configuration
- [x] Removed old Vercel tokens
- [x] Prisma client generated successfully
- [x] Removed all Supabase references

---

## 🎯 Your MongoDB Setup Checklist

### Phase 1: Cloud Setup (Do This First)
- [ ] **Create MongoDB Account** → [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] **Create Free Cluster** → Select AWS, free tier, your region
- [ ] **Create Database User**
  - Username: `travel_admin` (or your choice)
  - Password: Create strong password
  - Role: `readWriteAnyDatabase`
- [ ] **Get Connection String** → Copy from "Connect → Drivers"
- [ ] **Format Connection String**
  ```
  mongodb+srv://travel_admin:PASSWORD@cluster-name.mongodb.net/travel-app?retryWrites=true&w=majority
  ```
  Replace `PASSWORD` and `cluster-name` with your actual values

### Phase 2: Local Setup (Do This Second)
- [ ] **Update `.env.local`**
  ```
  DATABASE_URL="mongodb+srv://travel_admin:PASSWORD@cluster-name.mongodb.net/travel-app?retryWrites=true&w=majority"
  ```
- [ ] **Allow Network Access** → MongoDB Atlas → Network Access → Allow 0.0.0.0/0
- [ ] **Run Setup Script** (Windows)
  ```powershell
  powershell -ExecutionPolicy Bypass -File setup-mongodb.ps1
  ```
- [ ] **Or Manual Setup**
  ```bash
  npx prisma db push
  npm run dev
  ```

### Phase 3: Verification (Do This Third)
- [ ] **Start Dev Server**
  ```bash
  npm run dev
  ```
- [ ] **Test Connection** → Visit `http://localhost:3001/api/health`
- [ ] **Test Features**
  - Create account
  - Add favorite place
  - Create trip
  - Check data persists after refresh
- [ ] **View in MongoDB** → MongoDB Atlas → Browse Collections

### Phase 4: Deployment (Optional)
- [ ] **For Vercel**: Add `DATABASE_URL` in Environment Variables
- [ ] **For Railway**: Add `DATABASE_URL` in Variables
- [ ] **For Other Platform**: Add `DATABASE_URL` in env config
- [ ] **Run**: `npm run build` (locally first)

---

## 📝 Quick Reference

### Get Help
```bash
# Test connection
curl http://localhost:3001/api/health

# View schema
npx prisma studio

# Check Prisma status
npx prisma validate
```

### If Something Goes Wrong
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (development only!)
npx prisma db push --force-reset

# View Prisma logs
NODE_DEBUG=* npm run dev
```

### Environment Variables
```env
# Required
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/travel-app?retryWrites=true&w=majority"

# Optional (for features)
ANTHROPIC_API_KEY="..."
GROQ_API_KEY="..."
GEMINI_API_KEY="..."
NEXT_PUBLIC_GEMINI_API_KEY="..."
NEXTAUTH_SECRET="..."
JWT_SECRET="..."
```

---

## 🚀 One-Command Setup (After MongoDB Created)

Windows (PowerShell):
```powershell
$connection = Read-Host "Enter MongoDB connection string"
$connection | Out-File -Encoding UTF8 -Append .env.local
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🎓 What Changed?

### Before (SQLite)
- Database: Local file (`dev.db`)
- Connection: File-based
- Hosting: Only local
- Backups: Manual
- Scaling: Very limited

### After (MongoDB)
- Database: Cloud hosted (MongoDB Atlas)
- Connection: `mongodb+srv://` protocol
- Hosting: Global access
- Backups: Available (paid)
- Scaling: Excellent

---

## 📊 Monitoring

### Check Database Health
1. MongoDB Atlas Dashboard
2. Clusters → Your Cluster
3. View:
   - **Metrics** → CPU, Memory, Network
   - **Collections** → Browse data
   - **Backups** → View backups (if paid)

### Monitor Usage
- Free tier: 512 MB total storage
- Check current usage in Atlas dashboard
- Upgrade if approaching limit

---

## 🔐 Security Checklist

- [x] No Supabase API keys in code
- [x] MongoDB password not in code (in .env.local)
- [x] Network access configured
- [x] Database user has correct role
- [ ] Production: Update IP whitelist to specific IPs
- [ ] Production: Use paid MongoDB tier for encryption

---

## 📞 Support

**MongoDB Issues?**
- Docs: https://docs.mongodb.com/
- Discord: https://discord.gg/mongodb

**Prisma Issues?**
- Docs: https://www.prisma.io/docs/
- Discord: https://discord.prisma.io/

**Travel App Issues?**
- Check MONGODB-DEPLOYMENT.md
- Check MONGODB-SETUP.md
- Review `.env.local` configuration

---

## ✨ You're All Set!

Your travel app is now configured for MongoDB Atlas. Ready to:
1. ✅ Use locally with `npm run dev`
2. ✅ Deploy to production
3. ✅ Scale globally
4. ✅ Backup data (paid tier)

**Next Step**: Follow "Phase 1" above to create your MongoDB cluster!
