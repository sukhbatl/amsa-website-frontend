# AMSA Website Frontend

React + Vite frontend for the AMSA member site, blog, and announcements.

## Stack
- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Icons**: React Icons, Font Awesome
- **Animations**: AOS (Animate On Scroll)

## Prerequisites
- Node.js 18+ and npm
- Backend API running (see amsa-website-backend)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:4000
```

For production, set this to your deployed backend URL:
```env
VITE_API_URL=https://your-backend-api.com
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### 4. Build for Production
```bash
npm run build
```

The built files will be in the `dist/` folder.

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.com`)

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add environment variables:
   - `VITE_API_URL`: Your backend API URL
7. Click "Deploy"

### Environment Variables in Vercel

Go to your project → Settings → Environment Variables and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-api.com` | Backend API URL |

**Important**: After adding/changing environment variables, you need to redeploy for them to take effect.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   └── ...
├── pages/             # Page components
│   ├── HomePage.jsx
│   ├── BlogsPage.jsx
│   ├── AdminPage.jsx
│   └── ...
├── context/           # React Context
│   └── AuthContext.jsx
├── lib/               # Utilities
│   └── api.js        # API client
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## API Integration

The app uses the `api` helper from `src/lib/api.js` to communicate with the backend:

```javascript
import { api } from '../lib/api';

// Example: Fetch blogs
const blogs = await api('/api/blogs');

// Example: Login
const user = await api('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

## Features

- ✅ User authentication (login/signup)
- ✅ Blog browsing and reading
- ✅ Announcements display
- ✅ Admin dashboard (for authorized users)
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with AOS
- ✅ Protected routes with React Router

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues

If you're getting CORS errors or connection issues:

1. Verify `VITE_API_URL` is set correctly in your `.env` file
2. Make sure the backend is running
3. Check that your backend's `ALLOWED_ORIGINS` includes your frontend URL

### Build Errors

If you encounter build errors:

1. Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

2. Clear Vite cache:
```bash
rm -rf node_modules/.vite
```

### Vercel Deployment Issues

1. Check build logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Ensure `vercel.json` is present in the project root

## License

Private - AMSA Organization
