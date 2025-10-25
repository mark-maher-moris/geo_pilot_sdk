# GitHub to NPM Auto-Publishing Setup

This guide will help you connect your GitHub repository to npm for automatic publishing.

## 🚀 **Quick Setup**

### **Step 1: Create NPM Token**

1. Go to [npmjs.com](https://www.npmjs.com) and login
2. Click on your profile → **Access Tokens**
3. Click **Generate New Token**
4. Select **Automation** (for CI/CD)
5. Copy the token (starts with `npm_`)

### **Step 2: Add NPM Token to GitHub Secrets**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### **Step 3: Push to GitHub**

```bash
# Add the GitHub Actions workflows
git add .github/
git commit -m "feat: add GitHub Actions for auto-publishing"
git push origin main
```

## 🔄 **How It Works**

### **Automatic Publishing Triggers**

1. **Push to main branch**: Automatically bumps patch version and publishes
2. **Manual workflow**: Go to Actions tab → "Release and Publish" → Run workflow
3. **Tag creation**: Creates releases and publishes

### **Version Bumping**

- **Patch** (1.0.0 → 1.0.1): Bug fixes, small improvements
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

## 📋 **Workflow Files Created**

### **1. `.github/workflows/publish.yml`**
- Publishes to npm on push to main
- Runs tests and builds before publishing
- Uses NPM_TOKEN for authentication

### **2. `.github/workflows/release.yml`**
- Handles version bumping
- Creates GitHub releases
- Supports manual version selection

## 🛠 **Manual Publishing**

### **Option 1: GitHub Actions (Recommended)**
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Release and Publish**
4. Click **Run workflow**
5. Choose version type (patch/minor/major)
6. Click **Run workflow**

### **Option 2: Command Line**
```bash
# Bump version
npm version patch  # or minor, major

# Push changes
git push origin main --tags

# GitHub Actions will automatically publish
```

## 🔍 **Monitoring**

### **Check Publishing Status**
1. Go to **Actions** tab in your GitHub repo
2. Look for **Release and Publish** workflow
3. Click on the latest run to see logs

### **Verify NPM Publication**
```bash
# Check if package was published
npm view geo-pilot-sdk

# Check latest version
npm view geo-pilot-sdk version
```

## 🚨 **Troubleshooting**

### **Common Issues**

**Error: NPM_TOKEN not found**
- Make sure you added the secret in GitHub repository settings
- Check the secret name is exactly `NPM_TOKEN`

**Error: Package already exists**
- The version already exists on npm
- The workflow will automatically bump the version

**Error: Permission denied**
- Make sure your npm token has publish permissions
- Check you're logged into the correct npm account

### **Debug Steps**

1. **Check GitHub Secrets**: Settings → Secrets and variables → Actions
2. **Check NPM Token**: Make sure it's valid and has publish permissions
3. **Check Workflow Logs**: Actions tab → Click on failed workflow
4. **Test Locally**: Run `npm publish --dry-run` to test

## 📦 **Package Configuration**

The workflows will automatically:
- ✅ **Build** the package using `npm run build`
- ✅ **Test** using `npm test` (placeholder for now)
- ✅ **Bump version** in package.json
- ✅ **Create git tag** (e.g., v1.0.1)
- ✅ **Publish to npm** with the new version
- ✅ **Create GitHub release** with changelog

## 🎯 **Next Steps**

1. **Set up the NPM_TOKEN secret** in GitHub
2. **Push the workflow files** to your repository
3. **Test the workflow** by making a small change and pushing
4. **Monitor the Actions tab** to see the publishing process

Your SDK will now automatically publish to npm whenever you push changes to the main branch! 🚀
