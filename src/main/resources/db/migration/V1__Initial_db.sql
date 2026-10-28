CREATE TABLE roles (
    id   bigserial PRIMARY KEY,
    name character varying(50)  NOT NULL UNIQUE
    );

CREATE TABLE users (
    id       bigserial PRIMARY KEY,
    username character varying(100) NOT NULL UNIQUE,
    password character varying(255) NOT NULL
    );

CREATE TABLE user_roles (
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id bigint NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
    );

CREATE TABLE clients (
    id          bigserial              PRIMARY KEY,
    first_name  character varying(100) NOT NULL,
    middle_name character varying(100),
    last_name   character varying(100) NOT NULL,
    phone       character varying(50),
    email       character varying(255),
    age         integer,
    user_id     bigint                 UNIQUE REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE managers (
    id          bigserial              PRIMARY KEY,
    first_name  character varying(100) NOT NULL,
    second_name character varying(100),
    middle_name character varying(100),
    user_id     bigint                 UNIQUE REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE admins (
    id      bigserial              PRIMARY KEY,
    name    character varying(100) NOT NULL,
    user_id bigint                 UNIQUE REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE hotels (
    id    bigserial              PRIMARY KEY,
    name  character varying(255) NOT NULL,
    city  character varying(100) NOT NULL,
    stars integer                NOT NULL
    );

CREATE TABLE tours (
    id               bigserial              PRIMARY KEY,
    title            character varying(255) NOT NULL,
    country          character varying(100) NOT NULL,
    hotel_id         bigint                 NOT NULL REFERENCES hotels(id),
    start_date       date                   NOT NULL,
    duration_days    integer                NOT NULL,
    price_per_person numeric(12, 2)         NOT NULL,
    seats_available  integer                NOT NULL,
    burning_tour     boolean                DEFAULT false NOT NULL
    );

CREATE TABLE bookings (
    id           bigserial              PRIMARY KEY,
    client_id    bigint                 NOT NULL REFERENCES clients(id),
    tour_id      bigint                 NOT NULL REFERENCES tours(id),
    manager_id   bigint                 REFERENCES managers(id),
    people_count integer                NOT NULL,
    status       character varying(50)  DEFAULT 'NEW' NOT NULL
    );

CREATE TABLE payments (
    id         bigserial                   PRIMARY KEY,
    amount     numeric(12, 2)              NOT NULL,
    paid_at    timestamp without time zone NOT NULL,
    booking_id bigint                      NOT NULL REFERENCES bookings(id)
    );

-- Default roles
INSERT INTO roles (name) VALUES ('ROLE_CLIENT');
INSERT INTO roles (name) VALUES ('ROLE_MANAGER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');