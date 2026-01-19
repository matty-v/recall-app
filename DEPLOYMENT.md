# Deployment Guide

This document explains how to deploy the Recall app to Firebase Hosting with the custom domain recall.voget.io.

## Prerequisites

- Firebase project: `kinetic-object-322814`
- Service account: `github-actions-deploy@kinetic-object-322814.iam.gserviceaccount.com`
- Custom domain: `recall.voget.io`

## Setup Instructions

### 1. Configure GitHub Secrets

Add the Firebase service account credentials to your GitHub repository:

1. Generate a service account key for `github-actions-deploy@kinetic-object-322814.iam.gserviceaccount.com`:
   ```bash
   gcloud iam service-accounts keys create firebase-key.json \
     --iam-account=github-actions-deploy@kinetic-object-322814.iam.gserviceaccount.com \
     --project=kinetic-object-322814
   ```

2. Add the key to GitHub Secrets:
   - Go to: https://github.com/matty-v/recall-app/settings/secrets/actions
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the entire contents of `firebase-key.json`
   - Click "Add secret"

3. Delete the local key file for security:
   ```bash
   rm firebase-key.json
   ```

### 2. Configure Custom Domain in Firebase

1. Go to Firebase Console: https://console.firebase.google.com/project/kinetic-object-322814/hosting/sites
2. Click "Add custom domain"
3. Enter: `recall.voget.io`
4. Follow the verification steps (add TXT record to DNS)
5. Add the provided A and AAAA records to your DNS configuration

**DNS Records to Add:**
- Type: `A`, Name: `recall`, Value: (provided by Firebase)
- Type: `AAAA`, Name: `recall`, Value: (provided by Firebase)
- Type: `TXT`, Name: `recall`, Value: (for verification)

### 3. Verify Service Account Permissions

Ensure the service account has the required permissions:

```bash
# Grant Firebase Hosting Admin role
gcloud projects add-iam-policy-binding kinetic-object-322814 \
  --member="serviceAccount:github-actions-deploy@kinetic-object-322814.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"

# Grant Firebase API Admin role
gcloud projects add-iam-policy-binding kinetic-object-322814 \
  --member="serviceAccount:github-actions-deploy@kinetic-object-322814.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"
```

## Deployment Workflow

The deployment workflow (`.github/workflows/deploy.yml`) automatically deploys to Firebase when:
- A PR is merged to the `main` branch
- Direct pushes are made to the `main` branch

### Workflow Steps:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Build production bundle
5. Authenticate with Google Cloud
6. Deploy to Firebase Hosting
7. Output deployment URL

## Manual Deployment

To deploy manually from your local machine:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy to specific site
firebase deploy --only hosting:recall-voget-io
```

## Deployment URL

After deployment, the app will be available at:
- **Custom Domain:** https://recall.voget.io
- **Firebase URL:** https://kinetic-object-322814.web.app

## Troubleshooting

### Build Fails
- Check TypeScript compilation: `npm run build`
- Verify all dependencies are installed: `npm ci`

### Deployment Fails
- Verify service account credentials are correct in GitHub Secrets
- Check service account has required Firebase permissions
- Review GitHub Actions logs for detailed error messages

### Custom Domain Issues
- Verify DNS records are correctly configured
- Wait for DNS propagation (can take up to 24 hours)
- Check SSL certificate status in Firebase Console

## Firebase Configuration Files

- **`.firebaserc`**: Specifies the Firebase project
- **`firebase.json`**: Hosting configuration with caching rules and rewrites

### Caching Strategy
- **Static assets** (JS, CSS): Cached for 1 year with immutable flag
- **index.html**: No caching to ensure latest version
- **Service Worker**: No caching for instant updates
- **PWA Manifest**: Proper content-type header

## Security Notes

- Never commit service account keys to the repository
- Use GitHub Secrets for all sensitive credentials
- Service account has minimal required permissions
- Regularly rotate service account keys
