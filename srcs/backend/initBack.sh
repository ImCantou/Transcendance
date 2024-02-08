#!/bin/bash

rm -rf dist/
rm -rf nodes_modules/
rm -rf images/*

rm -rf src/prisma/migrations
npm install

# npx prisma db push --accept-data-loss
npx prisma migrate dev --name init
# npx prisma generate

#Start nest
npm run start:dev & npx prisma studio
