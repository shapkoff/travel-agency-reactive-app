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
    private int peopleCount = 1;
    private BookingStatus status = BookingStatus.NEW;
    private Double discountPercent = 0.0;
    private Double totalPrice = 0.0;

    @Transient
    private Client client;
    @Transient
    private Tour tour;
    @Transient
    private Manager manager;
    @Transient
    private List<Payment> payments = new ArrayList<>();
}
