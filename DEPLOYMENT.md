# Deployment Guide for Medcentric AI

This guide provides step-by-step instructions for deploying both the FastAPI backend and React frontend to production cloud platforms.

## Table of Contents

1. [Backend Deployment (Render)](#backend-deployment-render)
2. [Backend Deployment (Alternative Options)](#backend-deployment-alternatives)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Frontend Deployment (Alternative Options)](#frontend-deployment-alternatives)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## Backend Deployment (Render)

### Prerequisites
- GitHub account
- Render account (free tier available at [render.com](https://render.com))
- Repository pushed to GitHub

### Step 1: Prepare Your Repository

Ensure these files exist in your root directory:
- `main.py` (FastAPI application)
- `requirements.txt` (Python dependencies)
- `medcentric_model.pkl` (trained model)
- `model_columns.pkl` (feature columns)
- `cleaned_heart.csv` (optional, for reference)

### Step 2: Create Render Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `medcentric-backend` (or your choice)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: Free (or paid for better performance)

5. Click **"Create Web Service"**

### Step 3: Wait for Deployment

Render will:
- Clone your repository
- Install dependencies from `requirements.txt`
- Start the FastAPI server
- Provide a public URL like `https://medcentric-backend.onrender.com`

### Step 4: Test the Backend

Visit your backend URL:
```
https://your-backend-url.onrender.com/docs
```

You should see the FastAPI Swagger UI documentation.

---

## Backend Deployment (Alternatives)

### Heroku

1. Install Heroku CLI
2. Create a `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Deploy:
   ```bash
   heroku create medcentric-backend
   git push heroku main
   ```

### Railway

1. Connect GitHub repository at [railway.app](https://railway.app)
2. Railway auto-detects Python and uses `requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### AWS EC2

1. Launch an Ubuntu EC2 instance
2. SSH into the instance
3. Install Python and dependencies:
   ```bash
   sudo apt update
   sudo apt install python3-pip
   git clone <your-repo-url>
   cd medcentric-ai
   pip3 install -r requirements.txt
   ```
4. Run with Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
   ```
5. Set up Nginx as reverse proxy (recommended)

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- Backend already deployed and URL obtained

### Step 1: Configure Environment Variables

Create `.env.production` in the `frontend/` directory:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url.onrender.com` with your actual backend URL.

### Step 2: Deploy via Vercel CLI

```bash
# Navigate to frontend directory
cd frontend

# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 3: Deploy via Vercel Dashboard

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-url.onrender.com`

5. Click **"Deploy"**

### Step 4: Test the Frontend

Vercel will provide a URL like `https://medcentric-ai.vercel.app`

---

## Frontend Deployment (Alternatives)

### Netlify

```bash
cd frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Set environment variable in Netlify dashboard:
- `VITE_API_URL` = `https://your-backend-url.onrender.com`

### GitHub Pages (Static)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy `dist/` folder to GitHub Pages branch

3. **Note**: GitHub Pages doesn't support environment variables easily. You may need to hardcode the API URL in production build.

### AWS S3 + CloudFront

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload `dist/` contents to S3 bucket
3. Configure CloudFront distribution
4. Set bucket policy for public read access

---

## Environment Variables

### Backend (if needed)

Most configurations are embedded in `main.py`, but you can add:
- `PORT`: Automatically set by cloud providers
- `DATABASE_URL`: If you add database support in future
- `SECRET_KEY`: For JWT authentication (future feature)

### Frontend

**Development** (`.env.development`):
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Production** (`.env.production`):
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Important**: Never commit `.env` files to Git. They are already in `.gitignore`.

---

## Post-Deployment Testing

### 1. Test Backend API

Visit Swagger UI:
```
https://your-backend-url.onrender.com/docs
```

Test the `/predict` endpoint with sample data:
```json
{
  "age": 58,
  "trestbps": 140,
  "chol": 245,
  "thalch": 130,
  "oldpeak": 1.5,
  "fbs_True": 0,
  "exang_True": 1,
  "restecg_normal": 1,
  "restecg_st_abnomality": 0,
  "slope_flat": 1,
  "slope_upsloping": 0,
  "thal_normal": 1,
  "thal_reversable_defect": 0
}
```

Expected response:
```json
{
  "status": "High Risk",
  "risk_detected": true,
  "confidence": 87.45
}
```

### 2. Test Frontend

1. Visit your frontend URL
2. Verify the **Clinical Disclaimer Banner** is visible
3. Fill in the patient vitals form
4. Click **"Evaluate Heart Risk"**
5. Verify results appear with risk meter
6. Test **"Download Report"** button
7. Check session history log

### 3. Cross-Browser Testing

Test on:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4. Performance Testing

Use [Google PageSpeed Insights](https://pagespeed.web.dev/) to test:
- Load time
- Mobile responsiveness
- Accessibility score

---

## Troubleshooting

### Issue: CORS Error

**Symptom**: Browser console shows CORS error when frontend calls backend.

**Solution**: Ensure `main.py` has CORS middleware configured:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Backend "Application Error" on Render

**Symptom**: Render shows "Application Error" message.

**Solution**: Check Render logs:
1. Go to Render Dashboard → Your Service → Logs
2. Look for Python errors (missing files, import errors)
3. Ensure `medcentric_model.pkl` and `model_columns.pkl` are in repository

### Issue: Frontend Shows "Could not connect to backend"

**Symptom**: Frontend displays error message after form submission.

**Solution**:
1. Verify `VITE_API_URL` is set correctly in Vercel environment variables
2. Check browser console for exact error
3. Ensure backend is running (visit `/docs` endpoint)
4. Verify CORS is enabled on backend

### Issue: Model Predictions Are Incorrect

**Symptom**: All predictions show same result or nonsensical confidence scores.

**Solution**:
1. Re-train the model:
   ```bash
   python clean_data.py
   python train_model.py
   ```
2. Commit updated `.pkl` files
3. Redeploy backend

### Issue: Render Free Tier Spins Down

**Symptom**: First request after inactivity takes 30+ seconds.

**Solution**: Render free tier spins down after 15 minutes of inactivity. Options:
- Upgrade to paid plan ($7/month)
- Use a cron job to ping backend every 10 minutes:
  ```bash
  */10 * * * * curl https://your-backend-url.onrender.com/
  ```
- Accept the cold start delay (acceptable for demos)

---

## Production Best Practices

### Security
- [ ] Replace `allow_origins=["*"]` with specific frontend URL
- [ ] Add rate limiting to prevent API abuse
- [ ] Implement API authentication (if handling real patient data)
- [ ] Use HTTPS everywhere (enforced by Render and Vercel)

### Monitoring
- [ ] Set up Render alerts for backend crashes
- [ ] Monitor backend logs regularly
- [ ] Use Sentry or similar for error tracking (optional)

### Performance
- [ ] Enable caching headers for static assets
- [ ] Use CDN for frontend assets (Vercel does this automatically)
- [ ] Consider Redis for caching model predictions (future enhancement)

### Documentation
- [ ] Add API documentation link to frontend
- [ ] Create user guide for clinicians (if applicable)
- [ ] Document any changes to model or features

---

## Cost Estimation

### Free Tier (Development/Demo)
- **Backend**: Render Free (spins down after 15 min inactivity)
- **Frontend**: Vercel Free (unlimited bandwidth for personal projects)
- **Total**: $0/month

### Production Tier (Recommended for real usage)
- **Backend**: Render Starter Plan ($7/month, always-on, 512MB RAM)
- **Frontend**: Vercel Pro ($20/month, better performance and analytics)
- **Total**: $27/month

### Enterprise Tier (High traffic)
- **Backend**: AWS EC2 t3.medium ($30/month) + Load Balancer ($16/month)
- **Frontend**: AWS CloudFront + S3 (~$10/month for 100K requests)
- **Database**: AWS RDS for patient history ($15/month)
- **Total**: ~$71/month

---

## Next Steps After Deployment

1. **Domain Setup**: Purchase custom domain (e.g., `medcentric.ai`)
2. **SSL/TLS**: Already handled by Render and Vercel
3. **Analytics**: Add Google Analytics or Plausible
4. **Error Tracking**: Integrate Sentry for production error monitoring
5. **User Feedback**: Add feedback form for user experience improvement

---

## Support

For deployment issues, please:
1. Check Render/Vercel logs
2. Review this troubleshooting section
3. Open a GitHub issue with error logs
4. Contact the repository maintainer

---

**Last Updated**: October 16, 2026  
**Deployment Version**: 1.0
