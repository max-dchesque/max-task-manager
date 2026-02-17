# Dockerfile Audit & Fixes

## Problems Identified and Fixed

### 1. **Permission Denied Error (EACCES)**
**Problem:** `prisma generate` in deps stage created files with wrong permissions
**Solution:** Moved to builder stage where permissions are properly handled

### 2. **Prisma Version Conflict**
**Problem:** Global Prisma 7.x vs Project Prisma 6.x
**Solution:**
- Use `prisma@6` explicitly in all npx commands
- Install `prisma@6` globally in runner stage
- No version conflicts

### 3. **Multi-Stage Optimization**
**Problem:** Unnecessary copying and layer bloat
**Solution:**
- Clean separation: deps → builder → runner
- Only copy what's needed at each stage
- Use `--legacy-peer-deps` for compatibility

### 4. **Prisma Client Generation Timing**
**Problem:** Generated at wrong time, causing rebuilds
**Solution:**
- Generate in builder stage after source copy
- Use `--skip-generate` in db push (already generated)
- Copy generated client to runner stage

### 5. **User Permissions**
**Problem:** Running as root is a security risk
**Solution:**
- Create `nextjs` user (uid 1001)
- Switch before running app
- Proper ownership of files

## Key Improvements

1. **Explicit Version Pinning**: All Prisma commands use `@6` suffix
2. **Build Arguments**: DATABASE_URL passed as build arg
3. **Clean Layers**: npm cache clean after installs
4. **Error Handling**: Robust entrypoint with clear error messages
5. **Security**: Non-root user in production

## Verification Steps

After deployment:
1. ✅ Container starts without EACCES errors
2. ✅ Prisma generates client successfully
3. ✅ Database tables created on first run
4. ✅ Next.js serves pages correctly
5. ✅ Sidebar v2.0 visible in UI

## Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production" automatically
- `PORT` - Set to 3000 automatically
