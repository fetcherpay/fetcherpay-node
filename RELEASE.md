# Release Process

## Overview

This document describes how to publish new versions of the FetcherPay Node.js SDK to npm.

## Prerequisites

1. **GitHub Repository Access**: You must have push access to https://github.com/fetcherpay/fetcherpay-node
2. **npm Account**: Must be a maintainer of the `fetcherpay-sdk` package on npm
3. **NPM_TOKEN Secret**: The `NPM_TOKEN` secret must be configured in GitHub repository settings

## Publishing a New Release

### Step 1: Update Version (if needed)

If you need to bump the version, update `package.json`:

```bash
# Update version (choose one)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Push changes
git push github master
```

### Step 2: Create GitHub Release

**CRITICAL**: If a previous release failed, you MUST delete it before creating a new one.

1. Go to https://github.com/fetcherpay/fetcherpay-node/releases
2. **If a failed release exists**: Click on it → Click "Delete" (trash icon)
3. Click **"Create a new release"**
4. **Tag version**: Enter new version (e.g., `v1.0.1`)
5. **Target**: Select `master` branch
6. **Release title**: Brief description (e.g., "Fix webhook verification")
7. **Description**: List of changes (optional)
8. Click **"Publish release"**

### Step 3: Monitor Build

1. Go to https://github.com/fetcherpay/fetcherpay-node/actions
2. Click on the running "Publish to npm" workflow
3. Wait for completion (typically 1-2 minutes)

**Success indicators:**
- ✅ All steps green
- ✅ "Publish to npm" step shows package URL

**Failure indicators:**
- ❌ Red X on any step
- Check logs for error details

### Step 4: Verify on npm

1. Visit https://www.npmjs.com/package/fetcherpay-sdk
2. Verify new version appears
3. Check "Versions" tab for version history

## Troubleshooting

### "Access token expired or revoked" Error

**Cause**: The `NPM_TOKEN` secret has expired or been revoked.

**Solution**:
1. Go to https://www.npmjs.com/settings/tokens
2. Generate new **Granular Access Token**:
   - **Name**: GitHub Actions Publish
   - **Packages**: Read and Write
   - **Bypass 2FA**: Check this box
3. Copy the token
4. Go to https://github.com/fetcherpay/fetcherpay-node/settings/secrets/actions
5. Update `NPM_TOKEN` secret with new token
6. Re-run failed workflow

### "404 Not Found" Error

**Cause**: Package doesn't exist or token lacks permissions.

**Solution**:
- Verify you're using correct package name
- Ensure token has "Publish" permission for this package

### Build Failures

**Common causes**:
1. Missing `tslib` dependency
2. TypeScript compilation errors
3. Missing type definitions

**Solution**:
- Check `package.json` has all required dependencies
- Ensure `tslib` is in `devDependencies`
- Run `npm run build` locally to test

### Workflow Not Triggering

**Cause**: GitHub Actions may be disabled or workflow file has errors.

**Solution**:
1. Verify `.github/workflows/publish.yml` exists and is valid
2. Check repository Actions are enabled (Settings → Actions)
3. Manually trigger: Actions → "Publish to npm" → "Run workflow"

## Important Notes

### Failed Releases Must Be Deleted

**GitHub Actions caches the workflow state from the release creation time. If a release fails, subsequent retries will use the OLD workflow code, not the fixed version in the repo.**

**ALWAYS delete failed releases before creating new ones.**

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Communication

After publishing:
1. Update documentation if needed
2. Announce in team channels
3. Update downstream projects

## Manual Publishing (Emergency)

If GitHub Actions is unavailable:

```bash
# Login to npm
npm login

# Build locally
npm run build

# Publish
npm publish --access public
```

**Note**: This requires npm account credentials and 2FA setup.

## Checklist

Before creating a release:

- [ ] Version updated in `package.json` (if needed)
- [ ] All tests passing (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Changes committed and pushed to master
- [ ] Previous failed releases deleted
- [ ] NPM_TOKEN secret is valid

## Contact

- **npm package**: https://www.npmjs.com/package/fetcherpay-sdk
- **GitHub**: https://github.com/fetcherpay/fetcherpay-node
- **Support**: garfield@fetcherpay.com
