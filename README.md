# 🔖 Smart Bookmark App

A modern bookmark manager built with **Next.js** and **Supabase**, featuring **Google Authentication**, **real-time updates**, and **secure cloud storage**.  
Deployed on **Vercel**.

🌐 Live Demo: https://smart-bookmark-app-kappa-five.vercel.app/

---

## 🚀 Features

- 🔐 Google Authentication (Supabase Auth)
- ➕ Add & delete bookmarks
- ⏱ Real-time updates using Supabase Realtime
- 📅 Shows date & time when bookmark was saved
- 🔍 Search bookmarks instantly
- ☁️ Cloud database (PostgreSQL)
- 🌍 Deployed on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Supabase (Auth + Database + Realtime)
- **Deployment:** Vercel

---

## ⚠️ Problems Faced & Solutions

### 1. Google Authentication Not Working
**Problem:**  
Faced errors like:
- `Unsupported provider`
- `At least one Client ID is required`

**Solution:**  
Enabled Google provider in Supabase Auth settings and configured OAuth Client ID & Secret from Google Cloud Console. Also added correct redirect URLs for both local and production environments.

---

### 2. OAuth Redirect Loop After Login
**Problem:**  
After successful Google login, the app redirected back to the home page and user session was lost.

**Solution:**  
Handled Supabase auth session correctly on the client side and ensured session persistence after OAuth redirect.

---

### 3. Next.js Hydration Error
**Problem:**  
Got hydration warning:
> Server-rendered HTML did not match client properties

**Solution:**  
Moved browser-specific logic (`window`, auth checks) into client components and ensured consistent server-client rendering.

---

### 4. Deployment Issues on Vercel
**Problem:**  
App failed to work after deployment due to missing environment variables.

**Solution:**  
Added the following environment variables in Vercel dashboard and redeployed:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
