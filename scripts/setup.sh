#!/bin/bash

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <pguser> <pghost> <pgdata> <pgpass>" >&2
    exit 1
fi

# get PSQL variables as args
pguser=$1
pghost=$2
pgdata=$3
pgpass=$4

# set PSQL password
export PGPASSWORD=$pgpass

# create database
if [ "$( psql -U $pguser -h $pghost -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$pgdata'" )" != '1' ]; then
    psql -U $pguser -h $pghost -d postgres -c "CREATE DATABASE $pgdata";
fi

# create schema
psql -U $pguser -h $pghost -d $pgdata -f ../schema.sql

# download images 
curl -s -o ../public/images/placeholder.png https://raw.githubusercontent.com/jacquelinemarchal/schefs/backend/dev/images/placeholder.png?token=ADEH73WEORMCVOQPPTFTTZDAA4DMW

# run import script
node ./import.js
