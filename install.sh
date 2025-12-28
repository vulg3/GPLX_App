#!/bin/bash

echo "🚗 GPLX App - Installation Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "${YELLOW}⚠️  npm not found. Please install Node.js first.${NC}"
    exit 1
fi

echo "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "${GREEN}✅ Installation successful!${NC}"
    echo ""
    echo "🎯 Next steps:"
    echo "  1. Run: ${BLUE}npm run android${NC} or ${BLUE}npm run ios${NC}"
    echo "  2. Read: ${BLUE}QUICK_START.md${NC} for usage guide"
    echo "  3. Check: ${BLUE}UI_IMPROVEMENTS.md${NC} for animations"
    echo ""
    echo "✨ Features:"
    echo "  📚 Study mode with categorized questions"
    echo "  ✍️  25-question exam simulation"
    echo "  📊 History tracking with statistics"
    echo "  🎊 Confetti celebration on pass!"
    echo "  💫 Smooth animations throughout"
    echo ""
    echo "${GREEN}Happy learning! 🎓${NC}"
else
    echo ""
    echo "${YELLOW}⚠️  Installation failed. Please check errors above.${NC}"
    exit 1
fi





