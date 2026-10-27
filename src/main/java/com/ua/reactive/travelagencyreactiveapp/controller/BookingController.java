package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Booking;
import com.ua.reactive.travelagencyreactiveapp.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public Flux<Booking> getAllBookings() {
        return bookingService.getBookings();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Booking>> getBookingById(@PathVariable Long id) {
        return bookingService.getBooking(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<Booking> addNewBooking(@RequestBody Booking booking) {
        return bookingService.addBooking(booking);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Booking>> updateBooking(
            @PathVariable Long id,
            @RequestBody Booking booking) {
        return bookingService.updateBooking(id, booking)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteBooking(@PathVariable Long id) {
        return bookingService.getBooking(id)
                .flatMap(b ->
                        bookingService.deleteBooking(b)
                                .then(Mono.just(new ResponseEntity<Void>(HttpStatus.OK)))
                )
                .defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
