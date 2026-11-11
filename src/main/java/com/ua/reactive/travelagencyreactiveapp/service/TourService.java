package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.Tour;
import com.ua.reactive.travelagencyreactiveapp.entity.TourType;
import com.ua.reactive.travelagencyreactiveapp.repository.HotelRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.TourRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TourService {

    private final TourRepository tourRepository;
    private final HotelRepository hotelRepository;

    public TourService(TourRepository tourRepository, HotelRepository hotelRepository) {
        this.tourRepository = tourRepository;
        this.hotelRepository = hotelRepository;
    }

    public Flux<Tour> getTours(TourType tourType, Boolean burning) {
        Flux<Tour> tourFlux;
        if (tourType != null && burning != null) {
            tourFlux = tourRepository.findByTourTypeAndBurningTour(tourType, burning);
        } else if (tourType != null) {
            tourFlux = tourRepository.findByTourType(tourType);
        } else if (burning != null) {
            tourFlux = tourRepository.findByBurningTour(burning);
        } else {
            tourFlux = tourRepository.findAll();
        }

        return tourFlux.flatMap(this::enrichWithHotel);
    }

    public Mono<Tour> getTour(Long id) {
        return tourRepository.findById(id).flatMap(this::enrichWithHotel);
    }

    public Mono<Tour> createTour(Tour tour) {
        if (tour.getTourType() == null) {
            tour.setTourType(TourType.VACATION);
        }
        return tourRepository.save(tour).flatMap(this::enrichWithHotel);
    }

    public Mono<Tour> updateTour(Long id, Tour tour) {
        return tourRepository.findById(id)
                .flatMap(existing -> {
                    tour.setId(existing.getId());
                    return tourRepository.save(tour);
                })
                .flatMap(this::enrichWithHotel);
    }

    public Mono<Tour> setBurning(Long id, boolean burning) {
        return tourRepository.findById(id)
                .flatMap(tour -> {
                    tour.setBurningTour(burning);
                    return tourRepository.save(tour);
                })
                .flatMap(this::enrichWithHotel);
    }

    public Mono<Void> deleteTour(Long id) {
        return tourRepository.deleteById(id);
    }

    private Mono<Tour> enrichWithHotel(Tour tour) {
        if (tour.getHotelId() == null) {
            return Mono.just(tour);
        }
        return hotelRepository.findById(tour.getHotelId())
                .map(hotel -> {
                    tour.setHotel(hotel);
                    return tour;
                })
                .defaultIfEmpty(tour);
    }
}
