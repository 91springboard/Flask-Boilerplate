#!/usr/bin/env bash
if [ -d venv ]; then
    deactivate
    rm -rf venv
fi
virtualenv venv
. 'venv/bin/activate'
pip install -r requirements.txt
npm install
bower install
if [ -z $1 ]; then
    gulp build:local
elif [  $1 = 'dev' ]; then
    gulp build:dev
elif [  $1 = 'prod' ]; then
    gulp build:dev
else
    gulp build:local
fi
