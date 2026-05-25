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
printf '%s' "$MONGODB_URI" | npx vercel@latest env add MONGODB_URI production preview development --force
printf '%s' "$PROD_SECRET" | npx vercel@latest env add NEXTAUTH_SECRET production preview development --force

echo "==> Deploying to production..."
DEPLOY_URL=$(npx vercel@latest deploy --prod --yes)

echo ""
echo "Deployment complete!"
echo "URL: $DEPLOY_URL"
echo ""
echo "Next steps:"
echo "1. Open MongoDB Atlas → Network Access → allow 0.0.0.0/0"
echo "2. Run: npm run seed  (creates admin user if not exists)"
echo "3. Login with admin / admin123 and change the password"
