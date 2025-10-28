#!/bin/bash

# GEO Pilot SDK - Run Next.js Example

echo "🚀 Starting GEO Pilot SDK Next.js Example..."

# Check if we're in the SDK directory
if [ ! -f "package.json" ] || [ ! -d "examples/nextjs-blog" ]; then
    echo "❌ Please run this script from the SDK root directory"
    exit 1
fi

# Navigate to example directory
cd examples/nextjs-blog

# Check if setup has been run
if [ ! -f ".env.local" ]; then
    echo "📝 Running setup first..."
    ./setup.sh
fi

# Start the development server
echo "🌐 Starting development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo "📚 Blog page: http://localhost:3000/blog"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
