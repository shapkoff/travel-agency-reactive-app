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
public class Client {
    private int id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
    private String email;
    private int age;
    private List<Booking> bookings = new ArrayList<>();
}
