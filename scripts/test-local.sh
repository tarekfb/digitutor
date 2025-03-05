#!/bin/bash
set -e

# Set local variables
# reuseexisting=true
# baseurl="http://localhost:5173"

# Mock Playwright test command
CI=false BASE_URL="$baseurl" EMAIL_STUDENT="nina@example.com" EMAIL_TEACHER="tarek@example.com" PASSWORD_STUDENT="asdasdasd" PASSWORD_TEACHER="asdasdasd" npx playwright test  --config=playwright.config.ts
