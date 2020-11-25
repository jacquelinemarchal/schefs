#!/bin/bash

# get PSQL variables as args
pguser=$1
pghost=$2
pgdata=$3
pgpass=$4

# set PSQL password
export PGPASSWORD=$pgpass

# create schema
psql -U $pguser -h $pghost -d $pgdata -f ../schema.sql

# download test event images
curl -s -o ../dev/images/e1.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/selectableImages%2Fschefsoctober-1280-12.jpg?alt=media&token=5a12c023-bb11-421a-b089-87256c7acbc2 
curl -s -o ../dev/images/e2.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/selectableImages%2Fschefsoctober-1280-19.jpg?alt=media&token=85db0dc6-6cf0-4b45-9618-b64ab16dfdd7
curl -s -o ../dev/images/e3.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/selectableImages%2Fschefsoctober-1280-20.jpg?alt=media&token=c9100716-92b6-45fe-b7bd-5981cd463edf

# download test profile pictures
curl -s -o ../dev/images/p1.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/hostPictures%2F3uausku7CtfqHa629OhoLfwBSvE2%2BThe%20Individual%20Versus%20the%20Collective?alt=media&token=2e082ae4-5a99-47d8-91c8-d7b6439bb336
curl -s -o ../dev/images/p2.jpg https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/hostPictures%2FIBA9LoBaAia8KC4Kka6AyvkmY4L2%2BSustainable%20E-Commerce?alt=media&token=3a2a3a10-b09f-47f6-88ba-99ced2ee7466

# get root directory
root="$(dirname "$PWD")"

# create test users in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO users(
        email,
        phone,
        password,
        first_name,
        last_name,
        img_profile,
        bio,
        school,
        major,
        grad_year,
        is_admin
    )
    VALUES (
        'u1email@school.edu',
        '1-408-477-9572',
        'password1',
        'TestFirst1',
        'TestLast1',
        '$root/dev/images/p1.jpg',
        'Test Bio 1',
        'Test School 1',
        'Test Major 1',
        2001,
        FALSE
    ), (
        'u2email@school.it',
        NULL,
        'password2',
        'TestFirst2',
        'TestLast2',
        '$root/dev/images/p2.jpg',
        'Test Bio 2',
        'Test School 2',
        'Test Major 2',
        2002,
        TRUE
    ), (
        'u3email@gmail.com',
        '12345678901234567890',
        'password3',
        'TestFirst3',
        'TestLast3',
        NULL,
        NULL,
        'Test School 3',
        'Test Major 3',
        2003,
        FALSE
    )
"

# create test events in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO events(
        host_id,
        title,
        description,
        requirements,
        img_thumbnail,
        time_start,
        status
    )
    VALUES (
        1,
        'Event 1',
        'Description 1',
        'Requirements 1',
        '$root/dev/images/e1.jpg',
        NOW(),
        'pending'
    ), (
        2,
        'Event 2',
        'Description 2',
        NULL,
        '/dev/images/e2.jpg',
        NOW(),
        'approved'
    ), (
        3,
        'Event 3',
        'Description 3',
        'Requirements 3',
        '$root/dev/images/e3.jpg',
        NOW(),
        'denied'
    )
"

# create test tickets in PSQL
psql -U $pguser -h $pghost -d $pgdata -c "
    INSERT INTO tickets(
        user_id,
        event_id
    )
    VALUES (1, 2), (3, 2), (2, 1)
"

