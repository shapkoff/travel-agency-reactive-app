package com.ua.reactive.travelagencyreactiveapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("bookings")
public class Booking {
    @Id
    private Long id;
    private Long clientId;
    private Long tourId;
    private Long managerId;
    @Transient
    private Client client;
    @Transient
    private Tour tour;
    @Transient
    private Manager manager;
    private int peopleCount;
    private BookingStatus status = BookingStatus.NEW;
    @Transient
    private List<Payment> payments = new ArrayList<>();
}
