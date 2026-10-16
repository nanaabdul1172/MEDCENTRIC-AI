# Medcentric AI - Frontend

React + Vite + Tailwind CSS frontend for the Medcentric AI cardiovascular risk assessment platform.

## Features

- ⚠️ **Clinical Disclaimer Banner**: Prominent amber-styled safety notice
- 📊 **Interactive Risk Assessment Form**: Patient vitals input with validation
- 📈 **Visual Risk Meter**: Dynamic gauge showing prediction confidence
- 📋 **Session History Log**: Tabulated record of all assessments
- 💾 **Report Export**: Download assessments as text files
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔗 **Dynamic API Configuration**: Environment-based backend URL

## Tech Stack

- **React 19.2.8**: Modern hooks and functional components
- **Vite 8.3.0**: Lightning-fast build tool
- **Tailwind CSS 3.4.19**: Utility-first styling
- **PostCSS + Autoprefixer**: CSS processing

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:5173`

### Production Build
```bash
npm run build
```
Output in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## Environment Configuration

Create a `.env.production` file for production deployment:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

During local development, the app defaults to `http://127.0.0.1:8000`.

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Static Hosting
Upload the `dist/` folder to any static host (AWS S3, GitHub Pages, etc.)

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # React entry point
│   └── index.css      # Tailwind imports
├── public/            # Static assets
├── index.html         # HTML template
└── vite.config.js     # Vite configuration
```

## License

MIT License - see root README for details.
