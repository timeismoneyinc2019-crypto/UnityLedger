#!/bin/bash
# Breeze Repo Organizer & Prep Script for UPX Deployment

echo "🌀 Starting UPX Repo Cleanup & Organization..."

# 1️⃣ Ensure scripts folder exists
mkdir -p scripts
echo "✅ Ensured 'scripts/' folder exists"

# 2️⃣ Clean old 'script' folder
if [ -d "script" ]; then
    rm -rf script
    echo "🗑️ Removed old 'script/' folder"
fi

# 3️⃣ Move any stray deploy/build scripts into 'scripts/' (if they exist)
for f in deploy.js build.ts; do
    if [ -f "$f" ]; then
        mv "$f" scripts/
        echo "📦 Moved $f to scripts/"
    fi
done

# 4️⃣ Ensure core folders exist
for folder in artifacts contracts deployments reports attached_assets client; do
    mkdir -p "$folder"
    echo "✅ Ensured '$folder/' folder exists"
done

# 5️⃣ Create placeholders for white paper and QR code
WHITE_PAPER_PATH="attached_assets/UPX_white_paper.pdf"
WHITE_PAPER_QR_PATH="attached_assets/UPX_white_paper_QR.png"

if [ ! -f "$WHITE_PAPER_PATH" ]; then
    touch "$WHITE_PAPER_PATH"
    echo "📄 Placeholder created for white paper at $WHITE_PAPER_PATH"
fi

if [ ! -f "$WHITE_PAPER_QR_PATH" ]; then
    touch "$WHITE_PAPER_QR_PATH"
    echo "📱 Placeholder created for QR code at $WHITE_PAPER_QR_PATH"
fi

# 6️⃣ Reminder for deployer and wallets
echo "⚠️ Make sure your DEPLOYER_PRIVATE_KEY and wallet addresses are set in .env or in your deploy script"

echo "🎯 UPX Repo is now organized, cleaned, and ready for master deploy script!"
