package com.ua.reactive.travelagencyreactiveapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Manager {
    private int id;
    private String firstName;
    private String secondName;
    private String middleName;
    private List<Booking> bookings = new ArrayList<>();
}
