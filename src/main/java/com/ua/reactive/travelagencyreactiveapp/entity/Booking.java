package com.ua.reactive.travelagencyreactiveapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    private int id;
    private Client client;
    private Tour tour;
    private Manager manager;
    private int peopleCount;
    private BookingStatus status = BookingStatus.NEW;
    private List<Payment> payments = new ArrayList<>();
}
