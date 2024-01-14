#!/bin/sh
rm latest_all_days.json 
aws s3 cp s3://djmio/latest_all_days.json .
npm install --force
npm run build --force
aws s3 sync /app/dist s3://djmio-cf