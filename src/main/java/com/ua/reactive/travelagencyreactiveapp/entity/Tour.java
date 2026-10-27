package com.ua.reactive.travelagencyreactiveapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tour {
    private int id;
    private String title;
    private String country;
    private Hotel hotel;
    private LocalDate startDate;
    private int durationDays;
    private double pricePerPerson;
    private int seatsAvailable;
    private List<Booking> bookings = new ArrayList<>();
}
