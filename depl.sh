#! /bin/bash
LIB_ENV=development
npm uninstall -g db2objection
npm run build:dev
npm install -g
