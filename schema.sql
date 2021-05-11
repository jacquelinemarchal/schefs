CREATE TABLE thumbnails (
    tid           SERIAL PRIMARY KEY,
    location      VARCHAR NOT NULL,
    is_used       BOOLEAN NOT NULL
);

CREATE TABLE users (
    uid           SERIAL PRIMARY KEY,
    fb_uid        VARCHAR(255) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    phone         VARCHAR(31),
    first_name    VARCHAR(255) NOT NULL,
    last_name     VARCHAR(255) NOT NULL,
    img_profile   VARCHAR(255),
    bio           VARCHAR,
    school        VARCHAR(255) NOT NULL,
    major         VARCHAR(255) NOT NULL,
    grad_year     VARCHAR(255) NOT NULL,
    is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    eid           SERIAL PRIMARY KEY,
    host_name     VARCHAR(255) NOT NULL,
    host_school   VARCHAR(255) NOT NULL,
    host_bio      VARCHAR NOT NULL,
    title         VARCHAR(255) NOT NULL,
    description   VARCHAR NOT NULL,
    requirements  VARCHAR,
    thumbnail_id  INT NOT NULL REFERENCES thumbnails(tid),
    zoom_link     VARCHAR(255),
    zoom_id       VARCHAR(31),
    gcal_id       VARCHAR(63),
    time_start    TIMESTAMP NOT NULL,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(31)
);

CREATE TABLE tickets (
    user_id       INT NOT NULL REFERENCES users(uid),
    event_id      INT NOT NULL REFERENCES events(eid),
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);
CREATE UNIQUE INDEX tickets_idx ON tickets(user_id, event_id);

CREATE TABLE event_hosts (
    user_id       INT NOT NULL REFERENCES users(uid),
    event_id      INT NOT NULL REFERENCES events(eid),
    PRIMARY KEY (event_id, user_id)
);
CREATE UNIQUE INDEX event_hosts_idx ON event_hosts(user_id, event_id);

CREATE TABLE comments (
    cid           SERIAL PRIMARY KEY,
    event_id      INT NOT NULL REFERENCES events(eid),
    user_id       INT NOT NULL REFERENCES users(uid),
    name          VARCHAR(255) NOT NULL,
    school        VARCHAR(255) NOT NULL,
    body          VARCHAR NOT NULL,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE openmind (
    omid          SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(uid),
    body          VARCHAR(255) NOT NULL,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminders (
    rid           SERIAL PRIMARY KEY,
    time_send     TIMESTAMP NOT NULL,
    email_type    VARCHAR(31) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    first_name    VARCHAR(255) NOT NULL,
    event_title   VARCHAR(255) NOT NULL,
    zoom_link     VARCHAR(255)
);
