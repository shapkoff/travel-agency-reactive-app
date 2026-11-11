package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.Hotel;
import com.ua.reactive.travelagencyreactiveapp.repository.HotelRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Flux<Hotel> getHotels() {
        return hotelRepository.findAll();
    }

    public Mono<Hotel> getHotel(Long id) {
        return hotelRepository.findById(id);
    }

    public Mono<Hotel> addHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }
}
