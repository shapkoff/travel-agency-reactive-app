package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Booking;
import com.ua.reactive.travelagencyreactiveapp.entity.BookingStatus;
import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.service.BookingService;
import com.ua.reactive.travelagencyreactiveapp.service.ClientService;
import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final ClientService clientService;
    private final UserService userService;

    @GetMapping
    public Flux<Booking> getAllBookings() {
        return bookingService.getBookings();
    }

    @GetMapping("/my")
    public Flux<Booking> getMyBookings(Authentication authentication) {
        if (authentication == null) {
            return Flux.empty();
        }

        return userService.findByUsername(authentication.getName())
                .cast(User.class)
                .flatMap(user -> clientService.findByUserId(user.getId()))
                .flatMapMany(client -> bookingService.getBookingsByClientId(client.getId()));
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Booking>> getBookingById(@PathVariable Long id) {
        return bookingService.getBooking(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Booking> addNewBooking(@RequestBody Booking booking, Authentication authentication) {
        if (booking.getClientId() != null) {
            return bookingService.addBooking(booking);
        }

        if (authentication != null) {
            return userService.findByUsername(authentication.getName())
                    .cast(User.class)
                    .flatMap(user -> clientService.findByUserId(user.getId())
                            .switchIfEmpty(Mono.defer(() -> {
                                Client c = new Client();
                                c.setUserId(user.getId());
                                c.setFirstName(user.getUsername());
                                c.setLastName("Клієнт");
                                c.setEmail(user.getUsername() + "@travel.ua");
                                c.setDiscountPercent(0.0);
                                c.setIsRegular(false);
                                return clientService.addClient(c);
                            })))
                    .flatMap(client -> {
                        booking.setClientId(client.getId());
                        return bookingService.addBooking(booking);
                    });
        }

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

    @PatchMapping("/{id}/status")
    public Mono<ResponseEntity<Booking>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        BookingStatus status = BookingStatus.valueOf(statusStr.toUpperCase());
        return bookingService.updateStatus(id, status)
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
