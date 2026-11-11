package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Hotel;
import com.ua.reactive.travelagencyreactiveapp.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public Flux<Hotel> getAllHotels() {
        return hotelService.getHotels();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Hotel>> getHotelById(@PathVariable Long id) {
        return hotelService.getHotel(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Hotel> addHotel(@RequestBody Hotel hotel) {
        return hotelService.addHotel(hotel);
    }
}
