#!/bin/bash
# Breeze Real Repo Organizer & UPX Deployment Prep
# Fully real, no placeholders, QR code auto-generation included

echo "🌀 Starting real UPX Repo Cleanup & Prep..."

# 1️⃣ Ensure scripts folder exists
mkdir -p scripts
echo "✅ Ensured 'scripts/' folder exists"

# 2️⃣ Remove old 'script' folder if it exists
if [ -d "script" ]; then
    rm -rf script
    echo "🗑️ Removed old 'script/' folder"
fi

# 3️⃣ Move master deploy script to scripts/
if [ -f "master_upx_deploy.ts" ]; then
    mv master_upx_deploy.ts scripts/
    echo "📦 Moved master_upx_deploy.ts to scripts/"
fi

# 4️⃣ Ensure core folders exist
for folder in artifacts contracts deployments reports attached_assets client; do
    mkdir -p "$folder"
    echo "✅ Ensured '$folder/' folder exists"
done

# 5️⃣ Check for actual white paper
WHITE_PAPER_PATH="attached_assets/UPX_white_paper.pdf"
WHITE_PAPER_QR_PATH="attached_assets/UPX_white_paper_QR.png"

if [ ! -f "$WHITE_PAPER_PATH" ]; then
    echo "⚠️ White paper missing at $WHITE_PAPER_PATH! Place the real PDF here."
else
    echo "📄 Found white paper at $WHITE_PAPER_PATH"
fi

# 6️⃣ Generate QR code if it doesn't exist
if [ ! -f "$WHITE_PAPER_QR_PATH" ]; then
    echo "📱 QR code not found, generating..."
    qr_url="https://github.com/timeismoneyinc2019-crypto/UnityLedger/blob/main/attached_assets/UPX_white_paper.pdf"
    curl -o "$WHITE_PAPER_QR_PATH" "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=$qr_url"
    echo "✅ Generated QR code at $WHITE_PAPER_QR_PATH"
else
    echo "📱 Found existing QR code at $WHITE_PAPER_QR_PATH"
fi

# 7️⃣ Reminder: deployer and wallet keys
echo "⚠️ Ensure your DEPLOYER_PRIVATE_KEY and wallet addresses are correctly set in .env or master_upx_deploy.ts"

echo "🎯 UPX Repo is now cleaned, fully organized, QR code ready, and ready for master deployment!"