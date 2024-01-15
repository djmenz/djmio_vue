#!/bin/sh
aws s3 cp s3://djmio/latest_all_days.json .
npm install --force
npm run build --force
aws s3 sync /app/dist s3://djmio-cf
aws cloudfront create-invalidation --distribution-id E2CJKK1IEYX1J2 --paths "/*"