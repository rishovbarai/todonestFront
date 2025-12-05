# Netlify Deployment Guide

## Configuration

The frontend is configured for static site deployment on Netlify.

### Build Settings

- **Build command**: `npm run generate`
- **Publish directory**: `.output/public`
- **Node version**: Use Node.js 18 or higher

### Environment Variables (Optional)

If you need to override the API URL, add this in Netlify:

- `API_BASE_URL`: Your backend API URL (default: `https://todo-backend-production-8ea7.up.railway.app/api`)

### Deployment Steps

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `todonestFront` repository
4. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm run generate`
   - Publish directory: `.output/public`
5. Click "Deploy site"

### Post-Deployment

After deployment, update your backend CORS settings to include your Netlify domain:

1. Go to Railway backend dashboard
2. Add your Netlify URL to `ALLOWED_ORIGINS` environment variable
3. Format: `https://your-site.netlify.app,https://your-site.netlify.app/*`

### Troubleshooting

If build fails:
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check Netlify build logs for specific errors

