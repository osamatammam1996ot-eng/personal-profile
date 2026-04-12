# ✅ ACTION CHECKLIST - Before Phase 2

## Complete These 3 Steps to Prepare for Frontend Integration

---

## ☑️ ACTION 1: Copy Template & Create `.env.local`

**Time: 2 minutes**

### Step 1.1: Copy the template file
```bash
# In project root directory
cp .env.local.template .env.local
```

### Step 1.2: Get credentials from Supabase Dashboard

Go to: **https://app.supabase.com**

1. Click on project: **FigMakeTestDrive**
2. Click **Settings** (gear icon in left sidebar)
3. Click **API** tab
4. You'll see this section:

```
┌─ API Settings ─────────────────────┐
│ Project URL:                       │
│ https://lajgxkcqnqmgzofshqdg.     │
│ supabase.co                        │
│                                    │
│ Keys:                              │
│ anon [copy button]                 │
│ service_role [copy button]         │
└────────────────────────────────────┘
```

5. Copy these three values

### Step 1.3: Fill in `.env.local`

Open `.env.local` in your editor and replace:

```bash
# Replace XXX_REPLACE...XXX with actual values

VITE_SUPABASE_URL=https://lajgxkcqnqmgzofshqdg.supabase.co  # Keep as-is

VITE_SUPABASE_ANON_KEY=[PASTE the anon key here]

VITE_SUPABASE_SERVICE_ROLE_KEY=[PASTE the service_role key here]

VITE_SUPABASE_JWT_SECRET=[PASTE JWT Secret - find in Settings → API at bottom]
```

### Step 1.4: Save & Verify

```bash
# Check that .env.local was created
cat .env.local

# Should show your filled-in credentials (not XXX placeholders)
```

---

## ☑️ ACTION 2: Create Admin User

**Time: 5 minutes**

### Step 2.1: Go to Authentication

1. In Supabase Dashboard
2. Click **Authentication** (left sidebar)
3. Click **Users** tab

### Step 2.2: Add User

1. Click **Add User** button (top right)
2. Fill in the form:

```
Email:    osama@design (EXACT - must match)
Password: [Click "Generate a Password"]
```

3. Check: ☑️ "Auto-send sign-up confirmation email" (optional)
4. Click **Create User**

### Step 2.3: Verify

You should see confirmation that user was created.

**Note**: User will receive magic link or password via email if auto-send enabled.

---

## ☑️ ACTION 3: Restart Development Server

**Time: 1 minute**

### Step 3.1: Stop current dev server
```bash
# Press Ctrl+C in the terminal running 'npm run dev'
```

### Step 3.2: Start fresh
```bash
npm run dev
```

### Step 3.3: Check for errors

In browser console (F12), you should see:

```
✅ No errors about missing VITE_ variables
✅ No errors about Supabase connection
✅ Website still loads with hardcoded content (normal for now)
```

---

## ☑️ OPTIONAL: Verify Everything with Script

**Time: 2 minutes (optional)**

### Run verification script

```bash
# This script checks if everything is configured correctly
npm run verify:phase1

# Or manually:
node scripts/verify-phase-1.js
```

Expected output:
```
✅ .env.local exists
✅ VITE_SUPABASE_URL configured
✅ VITE_SUPABASE_ANON_KEY configured
✅ Connected to Supabase
✅ All 11 tables accessible
✅ Seed data verified
🟢 PHASE 1 VERIFICATION COMPLETE
```

---

## 📋 Quick Checklist

Mark off as you complete:

```
Phase 1 Backend Deployment Complete ✅

Next: Complete these 3 action items

☐ ACTION 1: Create .env.local
  ☐ cp .env.local.template .env.local
  ☐ Get credentials from Supabase Dashboard
  ☐ Fill in VITE_SUPABASE_URL
  ☐ Fill in VITE_SUPABASE_ANON_KEY
  ☐ Fill in VITE_SUPABASE_SERVICE_ROLE_KEY
  ☐ Fill in VITE_SUPABASE_JWT_SECRET
  ☐ Save file

☐ ACTION 2: Create Admin User
  ☐ Go to Supabase Dashboard
  ☐ Authentication → Users
  ☐ Click "Add User"
  ☐ Email: osama@design
  ☐ Password: Auto-generate
  ☐ Click "Create User"

☐ ACTION 3: Restart Dev Server
  ☐ Ctrl+C to stop current server
  ☐ npm run dev
  ☐ Check console for errors (should be none)

☐ OPTIONAL: Run verification script
  ☐ npm run verify:phase1
  ☐ Or: node scripts/verify-phase-1.js
  ☐ All checks should pass (✅)

✅ Ready for Phase 2!
```

---

## 🎯 Total Time: ~10 Minutes

| Step | Time | Task |
|------|------|------|
| 1 | 2 min | Copy template + fill in credentials |
| 2 | 5 min | Create admin user in Supabase |
| 3 | 1 min | Restart dev server |
| Optional | 2 min | Run verification script |
| **Total** | **~10 min** | **Ready for Phase 2** |

---

## 🚨 Common Issues

### "VITE_SUPABASE_URL is not defined"
- [ ] Check `.env.local` exists in project root
- [ ] Check it has `VITE_SUPABASE_URL=...` filled in
- [ ] Restart dev server with Ctrl+C then `npm run dev`

### "Invalid Anon key"
- [ ] Make sure you copied the FULL key (it's very long)
- [ ] Check for extra spaces at beginning/end
- [ ] Verify it comes from "anon" field, not "service_role"

### "User already exists"
- [ ] That's okay - you can reuse the same user
- [ ] Or create a new admin user with different email
- [ ] Update RLS policies if you use different email

### "Network error - cannot connect"
- [ ] Verify Supabase project status is ACTIVE (green dot)
- [ ] Check internet connection
- [ ] Verify URL doesn't have typos
- [ ] Try again in 1 minute

---

## ✅ What You'll Have After These 3 Steps

```
✅ .env.local configured
   └─ Frontend can connect to Supabase

✅ Admin user created
   └─ Can log in to admin dashboard

✅ Dev server running
   └─ No errors in console

✅ Ready for Phase 2
   └─ Begin frontend integration
```

---

## 🎬 Next: Phase 2 - Frontend Integration

Once you've completed these 3 actions:

1. Go to: [supabase/docs/frontend_integration_guide.md](supabase/docs/frontend_integration_guide.md)
2. Follow the step-by-step guide to:
   - Create CmsContext.tsx
   - Create useCmsSection hook
   - Update components
   - Test with real backend data

**Phase 2 Time**: ~1-2 hours once this is done

---

## 📞 Support

**Stuck?** Refer to:
- [PHASE_1_VERIFICATION.md](PHASE_1_VERIFICATION.md) — Detailed verification guide
- [PHASE_1_DEPLOYED.md](PHASE_1_DEPLOYED.md) — Deployment summary
- [supabase/docs/QUICKSTART.md](supabase/docs/QUICKSTART.md) — Quick reference

---

**You're so close!** Complete these 3 steps and Phase 2 begins. 🚀

