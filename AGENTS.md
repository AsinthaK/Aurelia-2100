# AI Agent Instructions & Project Guidelines

## Project Overview
- **Name**: Aurelia-2100 (`transportation-2100`)
- **Live URL**: https://aurelia-2100.vercel.app
- **Framework**: React 18 + TypeScript + Vite 5 + Tailwind CSS + Three.js (@react-three/fiber, @react-three/drei)

---

## Git Remotes & Deployment Architecture

### 1. Primary Deployment Repository (`origin`)
- **URL**: `https://github.com/batman2400/aurelia-2100.git`
- **Connected Platform**: **Vercel** (`uvarams-projects/aurelia-2100`)
- **Automated CI/CD**: Any push to `main` on `origin` automatically triggers a production deployment to [https://aurelia-2100.vercel.app](https://aurelia-2100.vercel.app).

### 2. Upstream Repository (`upstream`)
- **URL**: `https://github.com/AsinthaK/Aurelia-2100.git`
- Collaborator repository.

---

## Standard Push & Deploy Commands
To deploy new changes or updates:
```bash
git remote set-url origin https://github.com/batman2400/aurelia-2100.git
git push origin main
```

To sync latest changes from upstream:
```bash
git fetch upstream main
git merge upstream/main
git push origin main
```

---

## Build & Vercel Configuration
- **Build Command**: `npm run build` (`tsc && vite build`)
- **Output Directory**: `dist`
- **Vercel Config**: `vercel.json` provides SPA routing rewrites.
