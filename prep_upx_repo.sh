#!/bin/bash
# Breeze Real Repo Organizer & UPX Deployment Prep

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

# 5️⃣ Confirm actual white paper and QR code are in attached_assets
WHITE_PAPER_PATH="attached_assets/UPX_white_paper.pdf"
WHITE_PAPER_QR_PATH="attached_assets/UPX_white_paper_QR.png"

if [ ! -f "$WHITE_PAPER_PATH" ]; then
    echo "⚠️ White paper missing at $WHITE_PAPER_PATH! Place the real PDF here."
else
    echo "📄 Found white paper at $WHITE_PAPER_PATH"
fi

if [ ! -f "$WHITE_PAPER_QR_PATH" ]; then
    echo "⚠️ QR code missing at $WHITE_PAPER_QR_PATH! Place the real QR PNG here."
else
    echo "📱 Found QR code at $WHITE_PAPER_QR_PATH"
fi

# 6️⃣ Reminder: deployer and wallet keys
echo "⚠️ Ensure your DEPLOYER_PRIVATE_KEY and wallet addresses are correctly set in .env or master_upx_deploy.ts"

echo "🎯 UPX Repo is now cleaned, fully organized, and ready for master deployment!"