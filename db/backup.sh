#!/bin/sh

set -e

DB_URI=mongodb://heroku_4wp18fzf:1gogcqqv7n660r82ab9vcirmud@ds241268.mlab.com:41268/heroku_4wp18fzf

echo "Backing up MongoDB instance..."

echo "Dumping MongoDB $DB database to compressed archive"

mongodump --uri $DB_URI --out=./backup/mongobackup 
