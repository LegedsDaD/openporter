# Troubleshooting

This guide helps you resolve common issues when using OpenPorter.

## Table of Contents

- [General Issues](#general-issues)
- [Framework Detection Issues](#framework-detection-issues)
- [Build Issues](#build-issues)
- [Deployment Issues](#deployment-issues)
- [GitHub Pages Issues](#github-pages-issues)
- [Performance Issues](#performance-issues)
- [Authentication Issues](#authentication-issues)

## General Issues

### OpenPorter Not Detecting My Framework

**Symptoms:** Framework detection returns "No framework detected" or wrong framework

**Solutions:**

1. **Check file locations:**
   - Ensure config files are in repository root
   - Don't nest config files in subdirectories

2. **Verify config file names:**
   - Use standard names (e.g., `vite.config.ts` not `vite.config.custom.ts`)
   - Check for typos in file names

3. **Manual override:**
   ```json
   {
     "framework": "react",
     "buildCommand": "npm run build",
     "outputDir": "dist"
   }
   ```

4. **Check package.json:**
   - Ensure dependencies are listed correctly
   - Verify scripts section has build command

### Configuration Not Working

**Symptoms:** Settings not applied, deployment uses wrong configuration

**Solutions:**

1. **Validate JSON syntax:**
   ```bash
   # Use JSON validator
   cat .openporter.json | jq .
   ```

2. **Check file location:**
   - Must be in repository root
   - Named exactly `.openporter.json`

3. **Clear cache:**
   - Delete `.openporter` cache directory
   - Re-run detection

### TypeScript Errors in My Project

**Symptoms:** Build fails with TypeScript errors

**Solutions:**

1. **Check TypeScript version:**
   ```json
   {
     "nodeVersion": "20.x"  // Use newer Node for latest TypeScript
   }
   ```

2. **Skip type checking:**
   ```yaml
   - name: Build
     run: npm run build -- --skipLibCheck
   ```

3. **Fix type errors locally:**
   ```bash
   npx tsc --noEmit
   ```

## Framework Detection Issues

### Low Confidence Score

**Symptoms:** Detection returns < 50% confidence

**Solutions:**

1. **Add more config files:**
   - Ensure all framework config files are present
   - Don't remove standard config files

2. **Check for conflicts:**
   - Remove unused framework configs
   - Keep only one framework's config files

3. **Manual selection:**
   - Manually specify framework in config
   - Override auto-detection

### Wrong Framework Detected

**Symptoms:** Detects Vue instead of React, etc.

**Solutions:**

1. **Identify conflicting files:**
   - Check for multiple framework configs
   - Remove or rename conflicting files

2. **Use manual override:**
   ```json
   {
     "framework": "react"
   }
   ```

3. **Report issue:**
   - Help improve detection
   - Share your project structure

### Detection Works Locally But Not in CI

**Symptoms:** Works on local machine, fails in GitHub Actions

**Solutions:**

1. **Check file casing:**
   - Windows/macOS: case-insensitive
   - Linux (GitHub Actions): case-sensitive
   - Use consistent casing

2. **Verify file paths:**
   - Config files must be in root
   - Check for hidden characters

## Build Issues

### Build Fails with "Command Not Found"

**Symptoms:** `npm: command not found` or similar

**Solutions:**

1. **Check Node.js setup:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: 18.x
   ```

2. **Verify package manager:**
   ```json
   {
     "packageManager": "npm"
   }
   ```

3. **Use full path:**
   ```yaml
   - run: ./node_modules/.bin/vite build
   ```

### Build Fails with Dependency Errors

**Symptoms:** `Module not found`, `Cannot find module`

**Solutions:**

1. **Clean install:**
   ```yaml
   - run: rm -rf node_modules package-lock.json
   - run: npm install
   ```

2. **Check lock file:**
   - Ensure `package-lock.json` is committed
   - Don't add to `.gitignore`

3. **Verify dependencies:**
   ```bash
   npm install  # Test locally first
   ```

### Build Succeeds But Output Is Empty

**Symptoms:** No files in output directory

**Solutions:**

1. **Check build command:**
   ```json
   {
     "buildCommand": "npm run build"
   }
   ```

2. **Verify output directory:**
   ```json
   {
     "outputDir": "dist"
   }
   ```

3. **Test build locally:**
   ```bash
   npm run build
   ls -la dist  # Check if files exist
   ```

4. **Check build script:**
   ```json
   {
     "scripts": {
       "build": "vite build"  // Ensure this creates output
     }
   }
   ```

### Build Times Out

**Symptoms:** Workflow times out after 6 hours (GitHub limit)

**Solutions:**

1. **Optimize dependencies:**
   - Remove unused dependencies
   - Use lighter alternatives

2. **Enable caching:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: 18.x
       cache: npm
   ```

3. **Increase timeout:**
   ```yaml
   jobs:
     build:
       runs-on: ubuntu-latest
       timeout-minutes: 30
   ```

4. **Use faster runners:**
   - Consider GitHub Enterprise
   - Optimize build process

## Deployment Issues

### Deployment Fails with Permission Error

**Symptoms:** `Resource not accessible by integration`

**Solutions:**

1. **Check workflow permissions:**
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

2. **Verify GitHub Pages settings:**
   - Source must be "GitHub Actions"
   - Not "Deploy from a branch"

3. **Check repository settings:**
   - Go to Settings → Actions → General
   - Ensure "Read and write permissions" is enabled

### Deployment Succeeds But Site Shows 404

**Symptoms:** Workflow succeeds, but site returns 404

**Solutions:**

1. **Set base path:**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/<your-repo-name>/',
   });
   ```

2. **Check GitHub Pages URL:**
   - Format: `https://<username>.github.io/<repo>/`
   - Ensure repo name matches

3. **Wait for propagation:**
   - GitHub Pages can take 1-2 minutes
   - Clear browser cache

4. **Verify Pages is enabled:**
   - Go to Settings → Pages
   - Check if site is published

### Deployment Stuck in "In Progress"

**Symptoms:** Workflow never completes

**Solutions:**

1. **Check concurrency:**
   ```yaml
   concurrency:
     group: "pages"
     cancel-in-progress: false
   ```

2. **Review deployment history:**
   - Go to Settings → Pages
   - Check for stuck deployments
   - Cancel old deployments

3. **Re-run workflow:**
   - Go to Actions tab
   - Click "Re-run jobs"

### Artifact Upload Fails

**Symptoms:** `Error uploading artifact`

**Solutions:**

1. **Check artifact path:**
   ```yaml
   - uses: actions/upload-pages-artifact@v3
     with:
       path: ./dist  # Must exist and have files
   ```

2. **Verify directory exists:**
   ```yaml
   - name: Check build output
     run: ls -la ./dist
   ```

3. **Check artifact size:**
   - GitHub Pages limit: 10GB per artifact
   - Consider splitting large artifacts

## GitHub Pages Issues

### GitHub Pages Not Enabled

**Symptoms:** "GitHub Pages is not enabled for this repository"

**Solutions:**

1. **Enable in settings:**
   - Go to Settings → Pages
   - Under Source, select "GitHub Actions"
   - Click Save

2. **Check repository visibility:**
   - Free accounts: Public repos only
   - Private repos: Need GitHub Pro

3. **Verify organization settings:**
   - Org admin may need to enable Pages
   - Check org policies

### Custom Domain Not Working

**Symptoms:** Domain shows GitHub default or doesn't resolve

**Solutions:**

1. **Check DNS configuration:**
   ```
   # For subdomain
   CNAME: www → <username>.github.io
   
   # For apex domain
   A: @ → 185.199.108.153
   A: @ → 185.199.109.153
   A: @ → 185.199.110.153
   A: @ → 185.199.111.153
   ```

2. **Verify domain in settings:**
   - Go to Settings → Pages
   - Check custom domain is entered
   - Ensure no typos

3. **Wait for DNS propagation:**
   - Can take 24-48 hours
   - Use `dig` or `nslookup` to verify

4. **Enable HTTPS:**
   - Check "Enforce HTTPS"
   - Wait for certificate (5-10 min)

### HTTPS Certificate Issues

**Symptoms:** "Certificate not ready" or HTTPS not working

**Solutions:**

1. **Wait for provisioning:**
   - Takes 5-10 minutes after enabling
   - Can take longer for custom domains

2. **Check domain configuration:**
   - Ensure DNS is correct
   - Verify no conflicting SSL certs

3. **Force HTTPS:**
   - Enable "Enforce HTTPS" in settings
   - Clear browser cache

## Performance Issues

### Slow Build Times

**Symptoms:** Builds take > 5 minutes

**Solutions:**

1. **Enable caching:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: 18.x
       cache: npm
   ```

2. **Optimize dependencies:**
   - Remove unused packages
   - Use lighter alternatives
   - Audit with `npm audit`

3. **Use faster package manager:**
   ```json
   {
     "packageManager": "pnpm"  // or "bun"
   }
   ```

4. **Incremental builds:**
   ```yaml
   - run: npm run build -- --mode production
   ```

### Slow Deployment

**Symptoms:** Deployment takes long time after build

**Solutions:**

1. **Reduce artifact size:**
   - Don't upload unnecessary files
   - Use `.gitignore` and `.npmignore`
   - Exclude source maps in production

2. **Optimize assets:**
   - Compress images
   - Minify CSS/JS
   - Use tree shaking

3. **Check file count:**
   - GitHub Pages: Max 100,000 files
   - Consider bundling

### Cache Not Working

**Symptoms:** Cache hit rate is 0%

**Solutions:**

1. **Verify cache key:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: 18.x
       cache: npm  # Must match package manager
   ```

2. **Check lock file:**
   - Ensure `package-lock.json` exists
   - Commit lock file to repo

3. **Clear old caches:**
   - Go to Actions → Caches
   - Delete old caches

## Authentication Issues

### OAuth Login Fails

**Symptoms:** "Failed to authenticate with GitHub"

**Solutions:**

1. **Check OAuth app settings:**
   - Verify Client ID and Secret
   - Check callback URL matches

2. **Verify scopes:**
   - Required: `repo`, `workflow`, `pages`
   - Check in OAuth app settings

3. **Clear browser cookies:**
   - Clear GitHub cookies
   - Try incognito mode

### Token Expired

**Symptoms:** "Token has expired" or "Bad credentials"

**Solutions:**

1. **Re-authenticate:**
   - Sign out and sign in again
   - Generate new token

2. **Check token permissions:**
   - Must have `repo` scope
   - Must have `workflow` scope
   - Must have `pages` scope

3. **Use fine-grained tokens:**
   - More secure than classic tokens
   - Easier to revoke

### Insufficient Permissions

**Symptoms:** "Resource not accessible" or "Permission denied"

**Solutions:**

1. **Check token scopes:**
   - Go to Settings → Developer settings
   - Verify token has required scopes

2. **Verify repository access:**
   - Ensure token owner has repo access
   - Check for organization restrictions

3. **Use GitHub App:**
   - More granular permissions
   - Better for organizations

## Common Error Messages

### "No such file or directory"

**Cause:** Output directory doesn't exist or path is wrong

**Solution:**
```yaml
- name: Build
  run: npm run build

- name: Verify output
  run: ls -la ./dist  # Check directory exists

- uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

### "Workflow file is invalid"

**Cause:** YAML syntax error in workflow file

**Solution:**
- Validate YAML: https://www.yamllint.com/
- Check indentation (use spaces, not tabs)
- Verify all required fields are present

### "Pages site not found"

**Cause:** GitHub Pages not enabled

**Solution:**
1. Go to Settings → Pages
2. Enable GitHub Pages
3. Set source to "GitHub Actions"

### "Deployment failed"

**Cause:** Various deployment issues

**Solution:**
1. Check Actions logs for details
2. Verify workflow permissions
3. Ensure Pages is enabled
4. Check artifact was uploaded

### "Build exceeded maximum duration"

**Cause:** Build takes too long

**Solution:**
1. Optimize build process
2. Enable caching
3. Increase timeout:
   ```yaml
   timeout-minutes: 30
   ```

## Debugging Tips

### Enable Debug Logging

```yaml
- name: Debug
  run: |
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Current directory: $(pwd)"
    echo "Files in directory:"
    ls -la
    echo "Package.json:"
    cat package.json
  env:
    ACTIONS_STEP_DEBUG: true
```

### Test Build Locally

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run build
npm run build

# Check output
ls -la dist
```

### Validate Workflow

```bash
# Install actionlint
brew install actionlint

# Validate workflow
actionlint .github/workflows/*.yml
```

### Check GitHub Status

- Visit https://www.githubstatus.com/
- Check for GitHub Actions outages
- Check for GitHub Pages outages

## Getting Help

If you're still stuck:

1. **Search existing issues:**
   - https://github.com/LegedsDaD/openporter/issues

2. **Create a new issue:**
   - Include error messages
   - Share workflow file
   - Provide repository info (if public)

3. **Ask in discussions:**
   - https://github.com/LegedsDaD/openporter/discussions

4. **Check documentation:**
   - [Deployment Guide](deployment.md)
   - [Configuration](configuration.md)
   - [Workflow Generator](workflow-generator.md)

## Prevention

### Best Practices

1. **Test locally first:**
   ```bash
   npm run build
   ```

2. **Use lock files:**
   - Commit `package-lock.json`
   - Ensures reproducible builds

3. **Start simple:**
   - Use auto-detection
   - Add complexity gradually

4. **Monitor builds:**
   - Check Actions tab regularly
   - Set up notifications

5. **Keep dependencies updated:**
   - Regular `npm update`
   - Check for security advisories

### Checklist Before Deploying

- [ ] Build works locally
- [ ] All tests pass
- [ ] Dependencies are up to date
- [ ] Lock file is committed
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Base path set correctly
- [ ] GitHub Pages enabled
- [ ] Workflow file created
- [ ] Permissions configured