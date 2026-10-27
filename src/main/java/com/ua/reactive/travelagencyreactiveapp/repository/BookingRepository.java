package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.Booking;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface BookingRepository extends ReactiveCrudRepository<Booking, Long> {
}
