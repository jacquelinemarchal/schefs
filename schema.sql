CREATE TABLE users (
    uid           SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    phone         VARCHAR(31),
    password      VARCHAR(255) NOT NULL,
    first_name    VARCHAR(255) NOT NULL,
    last_name     VARCHAR(255) NOT NULL,
    img_profile   VARCHAR(255),
    bio           VARCHAR,
    school        VARCHAR(255) NOT NULL,
    major         VARCHAR(255) NOT NULL,
    grad_year     INT NOT NULL,
    is_admin      BOOLEAN DEFAULT FALSE
);

CREATE TABLE events (
    eid           SERIAL PRIMARY KEY,
    host_id       INT NOT NULL REFERENCES users(uid),
    title         VARCHAR(63) NOT NULL,
    description   VARCHAR NOT NULL,
    requirements  VARCHAR,
    img_thumbnail VARCHAR(255) NOT NULL,
    zoom_link     VARCHAR(255),
    zoom_id       VARCHAR(31),
    time_start    TIMESTAMP NOT NULL,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(31)
);

CREATE TABLE tickets (
    user_id       INT NOT NULL REFERENCES users(uid),
    event_id      INT NOT NULL REFERENCES events(eid),
    PRIMARY KEY (event_id, user_id)
);
CREATE UNIQUE INDEX tickets_idx ON tickets(user_id, event_id);

CREATE TABLE comments (
    cid           SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(uid),
    name          VARCHAR(255) NOT NULL,
    body          VARCHAR NOT NULL,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE openmind (
    omid          SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(uid),
    body          VARCHAR(255) NOT NULL,
    time_created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
