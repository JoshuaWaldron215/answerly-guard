#!/bin/bash

# Google Calendar Integration - Quick Deploy Script
# Run this after setting up Google OAuth credentials in Google Cloud Console

set -e

echo "🚀 Deploying Google Calendar Integration..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if user is logged in
echo "🔐 Checking Supabase login..."
if ! supabase projects list &> /dev/null; then
    echo "Please login to Supabase:"
    supabase login
fi

# Link to project if not already linked
echo "🔗 Linking to Supabase project..."
supabase link --project-ref gyqezbnqkkgskmhsnzgw || true

# Apply database migration
echo ""
echo "📊 Applying database migration..."
supabase db push

# Deploy Edge Function
echo ""
echo "⚡ Deploying Edge Function..."
supabase functions deploy google-calendar-oauth

# Set environment variables
echo ""
echo "🔧 Setting Edge Function secrets..."

read -p "Set Edge Function environment variables? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    supabase secrets set GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
    supabase secrets set GOOGLE_CLIENT_SECRET=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
    supabase secrets set GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
    supabase secrets set FRONTEND_URL=http://localhost:5173
    echo "✅ Secrets set!"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure redirect URIs in Google Cloud Console:"
echo "   https://console.cloud.google.com/apis/credentials"
echo ""
echo "   Add these redirect URIs:"
echo "   - https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth"
echo "   - http://localhost:5173/settings"
echo ""
echo "2. Test locally:"
echo "   npm run dev"
echo "   Go to Settings → Connect Google Calendar"
echo ""
echo "3. Deploy to production (Vercel):"
echo "   vercel --prod"
echo ""
echo "See DEPLOY_GOOGLE_CALENDAR.md for detailed instructions."
