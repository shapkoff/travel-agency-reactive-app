package com.ua.reactive.travelagencyreactiveapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table("tours")
public class Tour {
    @Id
    private Long id;
    private String title;
    private String country;
    private Long hotelId;
    private LocalDate startDate;
    private int durationDays;
    private double pricePerPerson;
    private int seatsAvailable;
    private boolean burningTour;
    private TourType tourType = TourType.VACATION;
    private String imageUrl;
    private String description;

    @Transient
    private Hotel hotel;

    @Transient
    private List<Booking> bookings = new ArrayList<>();
}
