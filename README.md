# Inventry - Frontend

![Inventry Frontend](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

The clean, modern, and high-performance client interface for the **Inventry** system. Designed to be completely responsive and incredibly fast seamlessly integrating state-of-the-art UI architectures.

## 🚀 Live Environment
**Production URL:** [https://inventry-frontend.vercel.app](https://inventry-frontend.vercel.app)

## ✨ Key Features
- **Intuitive Datagrids:** Rich, interactive tables for Products, Categories, Stock logs, and Orders featuring sort, filter, and bulk actions.
- **Role-Aware Dashboards:** Adapts to viewing users organically displaying metrics that are relevant depending on if they are an `admin` or a `manager`.
- **Intelligent Routing API Proxies:** Middleware authentication validation running on the Edge and seamless backend domain-unity routing (`/api/*`) for strict security and preventing out-of-bound CORS requirements.
- **Beautiful UI Components:** Uses Shadcn UI, customized themes, robust modals, toasts, and Radix accessibility primitives.
- **Comprehensive Analytics:** Aggregated real-time metrics with Recharts visualizing business health data.

## 🛠️ Technology Stack
- **Framework:** Next.js 15+ (App Router, Server Actions)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn-UI (Radix-UI)
- **Icons:** Lucide-React
- **Charts:** Recharts
- **Security:** Jose (for Edge JWT verification)

## ⚙️ Local Development

### Prerequisites
- Node.js (v20 or higher)

### Environment Variables
Create a `.env.local` file in the root directory:
```env
# Backend API Integration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Needs to perfectly match the backend for proper JWT verification checking!
JWT_SECRET=your_super_secret_key
```

### Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Start the Development Server**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the application.

3. **Production Build**
```bash
npm run build
npm run start
```

## 🏗️ Architecture & Deployment
Deployed globally across the Vercel Edge Network. The system implements a robust proxy setup (`next.config.ts` rewrites). By mapping all client-side requests to `/api/*`, the frontend successfully communicates smoothly over HTTPS, natively allowing cross-site secure cookie exchanges with the backend environment.
