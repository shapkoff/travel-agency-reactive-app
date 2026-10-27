CREATE TABLE hotels (
                        id    bigint                 NOT NULL,
                        name  character varying(255) NOT NULL,
                        city  character varying(100) NOT NULL,
                        stars integer                NOT NULL
);

CREATE TABLE clients (
                         id          bigint                 NOT NULL,
                         first_name  character varying(100) NOT NULL,
                         middle_name character varying(100),
                         last_name   character varying(100) NOT NULL,
                         phone       character varying(50),
                         email       character varying(255),
                         age         integer
);

CREATE TABLE managers (
                          id          bigint                 NOT NULL,
                          first_name  character varying(100) NOT NULL,
                          second_name character varying(100),
                          middle_name character varying(100)
);

CREATE TABLE tours (
                       id               bigint                 NOT NULL,
                       title            character varying(255) NOT NULL,
                       country          character varying(100) NOT NULL,
                       hotel_id         bigint                 NOT NULL,
                       start_date       date                   NOT NULL,
                       duration_days    integer                NOT NULL,
                       price_per_person numeric(12, 2)         NOT NULL,
                       seats_available  integer                NOT NULL,
                       burning_tour     boolean                DEFAULT false NOT NULL
);

CREATE TABLE bookings (
                          id           bigint                 NOT NULL,
                          client_id    bigint                 NOT NULL,
                          tour_id      bigint                 NOT NULL,
                          manager_id   bigint,
                          people_count integer                NOT NULL,
                          status       character varying(50)  DEFAULT 'NEW' NOT NULL
);

CREATE TABLE payments (
                          id         bigint                      NOT NULL,
                          amount     numeric(12, 2)              NOT NULL,
                          paid_at    timestamp without time zone NOT NULL,
                          booking_id bigint                      NOT NULL
);


ALTER TABLE hotels ADD PRIMARY KEY (id);

ALTER TABLE clients ADD PRIMARY KEY (id);

ALTER TABLE managers ADD PRIMARY KEY (id);

ALTER TABLE tours ADD PRIMARY KEY (id);

ALTER TABLE bookings ADD PRIMARY KEY (id);

ALTER TABLE payments ADD PRIMARY KEY (id);


ALTER TABLE tours
    ADD CONSTRAINT fk_tour_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(id);

ALTER TABLE bookings
    ADD CONSTRAINT fk_booking_client
        FOREIGN KEY (client_id) REFERENCES clients(id);

ALTER TABLE bookings
    ADD CONSTRAINT fk_booking_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id);

ALTER TABLE bookings
    ADD CONSTRAINT fk_booking_manager
        FOREIGN KEY (manager_id) REFERENCES managers(id);

ALTER TABLE payments
    ADD CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id);
