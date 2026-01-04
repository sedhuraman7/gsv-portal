
# 🚀 How to Deploy GSV Portal to Netlify (Correct Way)

⚠️ **IMPORTANT:** You cannot use "Drag and Drop" for this application.
Why? Because this app has **API Routes** (Login, Register, Database) which require a "Server". Drag & Drop only works for simple static websites (HTML/CSS).

### ✅ Step 1: Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com) and create a **New Repository**.
2.  Name it `gsv-internship-portal`.

### ✅ Step 2: Push Your Code (Run these commands in terminal)
Stop the running server (`Ctrl+C`) and run:

```powershell
git init
git add .
git commit -m "Final ready for deployment"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/gsv-internship-portal.git
git push -u origin main
```
*(Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username)*

### ✅ Step 3: Connect to Netlify
1.  Go to [Netlify.com](https://app.netlify.com).
2.  Click **"Add new site"** -> **"Import from an existing project"**.
3.  Choose **GitHub**.
4.  Select your `gsv-internship-portal` repository.
5.  Click **Deploy**.

### ✅ Step 4: Add Environment Variables (Crucial!)
Your app will fail initially because it doesn't know the Database Password.
1.  In Netlify Dashboard, go to **Site Settings** -> **Environment variables**.
2.  Add these keys (Copy values from your local `.env.local` file):
    *   `MONGODB_URI`  (Your long connection string)
    *   `JWT_SECRET`
    *   `ADMIN_SECRET`
    *   `NEXT_PUBLIC_APP_URL` (Set this to your Netlify link, e.g. `https://your-site.netlify.app`)

### ✅ Step 5: Done!
Netlify will automatically build the app and restart it.
Your Login and Registration will work perfectly connected to the Cloud Database.
