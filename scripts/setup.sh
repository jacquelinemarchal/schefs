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

# download test event images
curl -s -o ../dev/images/e1.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/chosenImages%2Fschefsoctober-1280-12.jpg?alt=media&token=5a12c023-bb11-421a-b089-87256c7acbc2 
curl -s -o ../dev/images/e2.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/chosenImages%2Fschefsoctober-1280-19.jpg?alt=media&token=85db0dc6-6cf0-4b45-9618-b64ab16dfdd7
curl -s -o ../dev/images/e3.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/chosenImages%2Fschefsoctober-1280-20.jpg?alt=media&token=c9100716-92b6-45fe-b7bd-5981cd463edf

# download test profile pictures
curl -s -o ../dev/images/p1.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/hostPictures%2F3uausku7CtfqHa629OhoLfwBSvE2%2BThe%20Individual%20Versus%20the%20Collective?alt=media&token=2e082ae4-5a99-47d8-91c8-d7b6439bb336
curl -s -o ../dev/images/p2.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/hostPictures%2FIBA9LoBaAia8KC4Kka6AyvkmY4L2%2BSustainable%20E-Commerce?alt=media&token=3a2a3a10-b09f-47f6-88ba-99ced2ee7466

# get root directory
root="$(dirname "$PWD")"

# create thumbnails in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO thumbnails(
        location,
        is_used
    )
    VALUES (
        '$root/dev/images/e1.jpg',
        true
    ), (
        '$root/dev/images/e2.jpg',
        true
    ), (
        '$root/dev/images/e3.jpg',
        true
    )
"

# create test users in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO users(
        fb_uid,
        email,
        phone,
        first_name,
        last_name,
        img_profile,
        bio,
        school,
        major,
        grad_year
    )
    VALUES (
        'bOBANGm9UzPWeZMymLQkqWScSbm1',
        'cyw2124@columbia.edu',
        '1-408-477-9572',
        'Christopher',
        'Wang',
        '$root/dev/images/p1.jpg',
        'I am Chris! B)',
        'Columbia University',
        'Math',
        2022
    ), (
        'HFCkIFwzX0euYQzZqRT5MMsVvd23',
        'jm4609@columbia.edu',
        '6463064032',
        'Jacqueline',
        'Marchal',
        '$root/dev/images/p2.jpg',
        'I am Jackie!',
        'Columbia University',
        'Computer Science',
        2022
    ), (
        'OszYRSpAzggaADSgMTdPYCGQe4a2',
        'll3257@columbia.edu',
        '9177699405',
        'Lola',
        'Lafia',
        NULL,
        NULL,
        'Columbia University',
        'Architecture & Computer Science',
        2023
    ), (
        'VrM3VRLQuqUKB382pmbW768yJVi1',
        'pedro.damasceno@columbia.edu',
        '9547742110',
        'Pedro',
        'Damasceno',
        NULL,
        'I am Pedro!',
        'Columbia University',
        'Comparative Literature',
        2023
    )
"

# create test events in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO events(
        host_name,
        host_school,
        title,
        description,
        requirements,
        thumbnail_id,
        zoom_link,
        zoom_id,
        time_start,
        status
    )
    VALUES (
        'Christopher',
        'Columbia University',
        'Event 1',
        'Description 1',
        'Requirements 1',
        1,
        'www.example.com',
        '123 456 789',
        NOW(),
        'pending'
    ), (
        'Jacqueline',
        'Columbia University',
        'Event 2',
        'Description 2',
        NULL,
        2,
        'www.example.com',
        '123 456 789',
        NOW(),
        'approved'
    ), (
        'Lola & Pedro',
        'Columbia University',
        'Event 3',
        'Description 3',
        'Requirements 3',
        3,
        'www.example.com',
        '123 456 789',
        NOW(),
        'denied'
    )
"

# create host links
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO event_hosts(
        user_id,
        event_id
    )
    VALUES (1, 1), (2, 2), (3, 3), (4, 3)
"

# create test tickets in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO tickets(
        user_id,
        event_id
    )
    VALUES (1, 2), (3, 2), (2, 1)
"

