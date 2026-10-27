CREATE TABLE IF NOT EXISTS hotels (
    id    BIGINT    GENERATED ALWAYS AS IDENTITY,
    name  character varying(255) NOT NULL,
    city  character varying(100) NOT NULL,
    stars integer                NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS clients (
    id          BIGINT    GENERATED ALWAYS AS IDENTITY,
    first_name  character varying(100) NOT NULL,
    middle_name character varying(100),
    last_name   character varying(100) NOT NULL,
    phone       character varying(50),
    email       character varying(255),
    age         integer,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS managers (
    id          BIGINT    GENERATED ALWAYS AS IDENTITY,
    first_name  character varying(100) NOT NULL,
    second_name character varying(100),
    middle_name character varying(100),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tours (
    id               BIGINT    GENERATED ALWAYS AS IDENTITY,
    title            character varying(255) NOT NULL,
    country          character varying(100) NOT NULL,
    hotel_id         bigint                 NOT NULL REFERENCES hotels(id),
    start_date       date                   NOT NULL,
    duration_days    integer                NOT NULL,
    price_per_person numeric(12, 2)         NOT NULL,
    seats_available  integer                NOT NULL,
    burning_tour     boolean                DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id           BIGINT    GENERATED ALWAYS AS IDENTITY,
    client_id    bigint                 NOT NULL REFERENCES clients(id),
    tour_id      bigint                 NOT NULL REFERENCES tours(id),
    manager_id   bigint                 REFERENCES managers(id),
    people_count integer                NOT NULL,
    status       character varying(50)  DEFAULT 'NEW' NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS payments (
    id         BIGINT    GENERATED ALWAYS AS IDENTITY,
    amount     numeric(12, 2)              NOT NULL,
    paid_at    timestamp without time zone NOT NULL,
    booking_id bigint                      NOT NULL REFERENCES bookings(id),
    PRIMARY KEY (id)
);
