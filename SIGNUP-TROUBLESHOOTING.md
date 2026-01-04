# 🐛 Signup Validation Troubleshooting Guide

## Common Validation Issues & Solutions

### Issue: "Validation failed" Error

This happens when the backend rejects your signup data. Here's what to check:

### ✅ Requirements Checklist

#### 1. **Name Field**
- ✅ Must be at least **2 characters long**
- ✅ Cannot be empty or just spaces
- ❌ DON'T use: `"J"`, `" "`, or `""`
- ✅ DO use: `"John Doe"`, `"Alice"`, `"Test User"`

#### 2. **Email Field**
- ✅ Must be a valid email format
- ✅ Must contain `@` symbol
- ❌ DON'T use: `"test"`, `"test@"`, `"@example.com"`
- ✅ DO use: `"test@example.com"`, `"user@gmail.com"`

#### 3. **Password Field**
Must meet ALL requirements:
- ✅ At least **8 characters** long
- ✅ Contains at least **1 uppercase letter** (A-Z)
- ✅ Contains at least **1 lowercase letter** (a-z)
- ✅ Contains at least **1 number** (0-9)

❌ **BAD passwords:**
- `"password"` - no uppercase, no number
- `"Password"` - no number
- `"Pass123"` - only 7 characters
- `"12345678"` - no letters

✅ **GOOD passwords:**
- `"Test123456"`
- `"SecurePass1"`
- `"MyPassword9"`
- `"Welcome2024"`

#### 4. **Terms Checkbox**
- ✅ Must check "I accept the terms and conditions"

## 🧪 Test With These Values

### Valid Test User #1
```
Name: John Doe
Email: john@example.com
Password: Test123456
Terms: ✓ Checked
```

### Valid Test User #2
```
Name: Alice Smith
Email: alice@test.com
Password: SecurePass1
Terms: ✓ Checked
```

### Valid Test User #3
```
Name: Bob Wilson
Email: bob123@gmail.com
Password: MyPassword9
Terms: ✓ Checked
```

## 🔍 Check Browser Console for Details

1. Open Browser DevTools: **F12** or **Right-click → Inspect**
2. Go to **Console** tab
3. Try to signup
4. Look for logs:
   ```
   Sending signup request: { email: "...", name: "...", password: "[HIDDEN]" }
   Signup response: { success: false, message: "...", errors: {...} }
   ```

The `errors` object will tell you EXACTLY what's wrong:
- `errors.name` → Name validation failed
- `errors.email` → Email validation failed
- `errors.password` → Password validation failed

## 📋 Step-by-Step Test

### Step 1: Go to Register Page
http://localhost:3000/register

### Step 2: Fill Form Correctly
```
Full Name: Test User        [2+ characters, not empty]
Email: test@example.com     [valid email format]
Password: TestPass123       [8+ chars, uppercase, lowercase, number]
☑ I accept the terms        [checked]
```

### Step 3: Check Password Indicators
Before clicking "Create Account", verify all 3 checkmarks are green:
- ✓ At least 8 characters
- ✓ Contains a number
- ✓ Contains uppercase letter

### Step 4: Click "Create Account"

### Step 5: Check Results
- ✅ **Success**: Redirected to `/profile` with your name displayed
- ❌ **Failed**: Red error box appears with specific error message

## 🔧 Debug Specific Errors

### Error: "Name is required"
**Problem**: Name field is empty
**Solution**: Enter at least 2 characters in the name field

### Error: "Name must be at least 2 characters long"
**Problem**: Name is only 1 character (e.g., "J")
**Solution**: Use full name like "John" or "Jane"

### Error: "Invalid email format"
**Problem**: Email doesn't match pattern (has no @, missing domain, etc.)
**Solution**: Use format like `username@domain.com`

### Error: "Password must be at least 8 characters"
**Problem**: Password too short
**Solution**: Add more characters (minimum 8)

### Error: "Password must contain uppercase letter"
**Problem**: Password has no A-Z
**Solution**: Add at least one capital letter

### Error: "Password must contain lowercase letter"
**Problem**: Password has no a-z
**Solution**: Add at least one lowercase letter

### Error: "Password must contain a number"
**Problem**: Password has no 0-9
**Solution**: Add at least one digit

### Error: "Email already exists"
**Problem**: You already created an account with this email
**Solution**: Use the **Login** page instead, or use different email

## 🎯 Quick Fix Checklist

Before submitting, verify:
- [ ] Name has 2+ characters
- [ ] Email has @ symbol and domain
- [ ] Password is 8+ characters
- [ ] Password has uppercase letter (A-Z)
- [ ] Password has lowercase letter (a-z)
- [ ] Password has number (0-9)
- [ ] Terms checkbox is checked
- [ ] All 3 password indicators show green checkmarks

## 🚀 If Still Not Working

### Option 1: Use Browser Console
1. Open Console (F12)
2. Look for the `Signup response:` log
3. Copy the `errors` object
4. Share the exact error message

### Option 2: Check API Directly
Open a new PowerShell and test the API:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/signup" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Option 3: Check Database
Maybe the user already exists:
```powershell
npx prisma studio
```
- Open http://localhost:5555
- Click "User" table
- Check if email already exists

## ✨ Summary

**Most Common Issue**: Password doesn't meet all requirements
**Quick Fix**: Use `Test123456` as password (guaranteed to work!)

**Second Most Common**: Forgot to check terms checkbox
**Quick Fix**: Click the checkbox before submitting

**Third Most Common**: Email already used
**Quick Fix**: Use login page instead or different email
