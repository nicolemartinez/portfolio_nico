# Deployment Guide for Portfolio Site

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Your Sanity project ID and dataset name

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git add .
git commit -m "Initial portfolio site"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./ (leave as is)
   - Build Command: `npm run build` (default)
   - Output Directory: .next (default)

5. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=Nico Phipps Portfolio
   ```

6. Click "Deploy"

## Step 3: Set Up Your Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add your custom domain (e.g., nicophipps.com)
4. Follow Vercel's instructions to update your DNS

## Step 4: Deploy Sanity Studio

You have two options:

### Option A: Deploy Studio to Sanity (Recommended)
```bash
npm run sanity:deploy
```
- Choose a unique hostname (e.g., nico-portfolio)
- Your studio will be at: https://nico-portfolio.sanity.studio

### Option B: Include Studio in Your Next.js App
Your studio is already accessible at `/studio` on your deployed site.

## Step 5: Configure CORS for Sanity

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to "API" → "CORS Origins"
4. Add your production URL:
   - `https://your-domain.vercel.app`
   - `https://your-custom-domain.com` (if using custom domain)

## Continuous Editing with Sanity

### For Content Editors:
1. **Production Studio URL**: 
   - If deployed separately: `https://your-studio-name.sanity.studio`
   - If included in Next.js: `https://your-site.com/studio`

2. **Login**: Use the same credentials you use locally

3. **Real-time Updates**: 
   - Changes in Sanity are immediately saved
   - Your live site updates automatically (may take 1-2 minutes due to caching)

### For Developers:

1. **Local Development**:
   ```bash
   npm run dev          # Next.js on localhost:3001
   npm run sanity dev   # Sanity Studio on localhost:3333
   ```

2. **Environment Setup**:
   Create `.env.local` with your Sanity credentials:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   ```

3. **Making Code Changes**:
   - Edit code locally
   - Test thoroughly
   - Push to GitHub
   - Vercel auto-deploys on push to main branch

## Best Practices

1. **Content Management**:
   - Always edit content through Sanity Studio
   - Never hardcode content in the code
   - Use the production dataset for live content

2. **Development Workflow**:
   - Use feature branches for code changes
   - Test locally before pushing
   - Set up preview deployments for branches

3. **Performance**:
   - Images are already optimized
   - Next.js handles caching automatically
   - Monitor Core Web Vitals in Vercel dashboard

## Troubleshooting

**Site not updating after Sanity changes?**
- Check if you're editing the correct dataset (production)
- Clear your browser cache
- Wait 1-2 minutes for CDN cache to update

**CORS errors?**
- Make sure your production URL is added to Sanity CORS origins
- Include both `https://` and `https://www.` versions if using custom domain

**Build errors on Vercel?**
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set
- Make sure all dependencies are in package.json

## Useful Commands

```bash
# Check which Sanity dataset you're using
npm run sanity dataset list

# Deploy Sanity Studio
npm run sanity:deploy

# Build locally to test
npm run build

# Check for TypeScript errors
npm run type-check
``` 