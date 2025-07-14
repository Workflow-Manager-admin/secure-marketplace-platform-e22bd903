#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-marketplace-platform-e22bd903/easy_buy_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

