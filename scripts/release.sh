#!/bin/bash

# Release script for CursorX
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 1.0.1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version argument is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Version argument is required${NC}"
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh 1.0.1"
  exit 1
fi

VERSION=$1

# Validate version format (should be X.Y.Z)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error: Invalid version format${NC}"
  echo "Version should be in format: X.Y.Z (e.g., 1.0.1)"
  exit 1
fi

echo -e "${YELLOW}🚀 Starting release process for version ${VERSION}${NC}"
echo ""

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}Error: Working directory is not clean${NC}"
  echo "Please commit or stash your changes first"
  git status -s
  exit 1
fi

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${YELLOW}Warning: You are not on main branch (current: ${CURRENT_BRANCH})${NC}"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Run tests
echo -e "${YELLOW}📋 Running tests...${NC}"
npm run test
if [ $? -ne 0 ]; then
  echo -e "${RED}Tests failed! Aborting release.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Tests passed${NC}"
echo ""

# Run lint check
echo -e "${YELLOW}🔍 Running lint check...${NC}"
npm run lint:check
if [ $? -ne 0 ]; then
  echo -e "${RED}Lint check failed! Aborting release.${NC}"
  echo "Run 'npm run lint:all' to fix issues"
  exit 1
fi
echo -e "${GREEN}✅ Lint check passed${NC}"
echo ""

# Update package.json version
echo -e "${YELLOW}📝 Updating package.json to version ${VERSION}...${NC}"
npm version $VERSION --no-git-tag-version
echo -e "${GREEN}✅ Version updated${NC}"
echo ""

# Commit version change
echo -e "${YELLOW}💾 Committing version change...${NC}"
git add package.json package-lock.json
git commit -m "chore: bump version to ${VERSION}"
echo -e "${GREEN}✅ Changes committed${NC}"
echo ""

# Create git tag
echo -e "${YELLOW}🏷️  Creating tag v${VERSION}...${NC}"
git tag -a "v${VERSION}" -m "Release version ${VERSION}"
echo -e "${GREEN}✅ Tag created${NC}"
echo ""

# Push to remote
echo -e "${YELLOW}⬆️  Pushing to remote...${NC}"
git push origin $CURRENT_BRANCH
git push origin "v${VERSION}"
echo -e "${GREEN}✅ Pushed to remote${NC}"
echo ""

echo -e "${GREEN}🎉 Release v${VERSION} created successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. 🔗 Check build progress: https://github.com/luckrnx09/CursorX/actions"
echo "2. 📦 View release when ready: https://github.com/luckrnx09/CursorX/releases/tag/v${VERSION}"
echo "3. ⏰ Build typically takes 10-20 minutes"
echo ""
