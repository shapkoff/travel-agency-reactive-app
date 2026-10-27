package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.Booking;
import com.ua.reactive.travelagencyreactiveapp.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Flux<Booking> getBookings() {
        return bookingRepository.findAll();
    }

    public Mono<Booking> getBooking(Long id) {
        return bookingRepository.findById(id);
    }

    public Mono<Booking> addBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Mono<Booking> updateBooking(Long id, Booking booking) {
        return bookingRepository.findById(id)
                .flatMap(b -> {
                    booking.setId(b.getId());
                    return bookingRepository.save(booking);
                });
    }

    public Mono<Void> deleteBooking(Booking booking) {
        return bookingRepository.delete(booking);
    }
}
