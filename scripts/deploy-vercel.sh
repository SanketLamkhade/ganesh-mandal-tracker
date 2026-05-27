#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "Error: .env.local not found. Create it with MONGODB_URI and NEXTAUTH_SECRET."
  exit 1
fi

# shellcheck disable=SC1091
source .env.local

if [ -z "${MONGODB_URI:-}" ]; then
  echo "Error: MONGODB_URI is missing in .env.local"
  exit 1
fi

PROD_SECRET="${NEXTAUTH_SECRET:-$(openssl rand -base64 32)}"

echo "==> Logging in to Vercel (free Hobby plan)..."
npx vercel@latest login

echo "==> Linking project..."
npx vercel@latest link --yes

echo "==> Setting environment variables..."
npx vercel@latest env add MONGODB_URI production --value "$MONGODB_URI" --yes --force
npx vercel@latest env add NEXTAUTH_SECRET production --value "$PROD_SECRET" --yes --force --sensitive
npx vercel@latest env add NEXTAUTH_URL production --value "https://ganesh-mandal-tracker.vercel.app" --yes --force
npx vercel@latest env add NEXT_PUBLIC_APP_URL production --value "https://ganesh-mandal-tracker.vercel.app" --yes --force

echo "==> Deploying to production..."
npx vercel@latest deploy --prod --yes

echo ""
echo "Live at: https://ganesh-mandal-tracker.vercel.app"
echo ""
echo "Next steps:"
echo "1. MongoDB Atlas → Network Access → allow 0.0.0.0/0"
echo "2. Run: npm run seed"
echo "3. Login with admin / admin123"
