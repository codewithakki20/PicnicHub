# 🔧 Signup Error Fix

## Problem Identified
The signup is failing with "Server error" because the backend cannot connect to MongoDB. 

**Root Cause:** `MONGODB_URI` is not set in your `.env` file.

## Solution

### Option 1: Using MongoDB Atlas (Recommended for Development)

1. Open `backend/.env` file in your editor
2. Add or update the `MONGODB_URI` variable:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

**To get your MongoDB connection string:**

- If you have MongoDB Atlas:
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
  2. Click "Connect" on your cluster
  3. Choose "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your database password
  6. Replace `<dbname>` with your database name (e.g., `picnichub`)
  
  Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/picnichub?retryWrites=true&w=majority`

- If you don't have MongoDB Atlas:
  1. Go to https://www.mongodb.com/cloud/atlas/register
  2. Create a free account
  3. Create a new cluster (free tier is fine)
  4. Create a database user
  5. Get the connection string as above

### Option 2: Using Local MongoDB

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/picnichub
```

### Option 3: Use the Deployed Database

Since your app is deployed at `https://picnichub.onrender.com`, you likely have a production MongoDB URI. Check your Render dashboard for the environment variable and use that same URI locally:

1. Go to your Render dashboard
2. Find your backend service
3. Check the Environment tab for `MONGODB_URI`
4. Copy that value to your local `.env` file

## After Fixing

1. Save the `.env` file
2. Restart your backend server:
   - Press `Ctrl+C` in the backend terminal
   - Run `npm run dev` again
3. Try signing up again in the mobile app

## Verify the Fix

Run this command to verify your MongoDB connection:

```bash
cd backend
node test-signup-debug.js
```

You should see "✅ Connected to MongoDB" and "✅ User created successfully!"
