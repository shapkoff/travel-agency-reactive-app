package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Tour;
import com.ua.reactive.travelagencyreactiveapp.entity.TourType;
import com.ua.reactive.travelagencyreactiveapp.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public Flux<Tour> getAllTours(
            @RequestParam(required = false) TourType type,
            @RequestParam(required = false) Boolean burning) {
        return tourService.getTours(type, burning);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Tour>> getTourById(@PathVariable Long id) {
        return tourService.getTour(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Tour> createTour(@RequestBody Tour tour) {
        return tourService.createTour(tour);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Tour>> updateTour(@PathVariable Long id, @RequestBody Tour tour) {
        return tourService.updateTour(id, tour)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/burning")
    public Mono<ResponseEntity<Tour>> setBurning(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Boolean burning = payload.getOrDefault("burning", true);
        return tourService.setBurning(id, burning)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteTour(@PathVariable Long id) {
        return tourService.getTour(id)
                .flatMap(tour -> tourService.deleteTour(id)
                        .then(Mono.just(new ResponseEntity<Void>(HttpStatus.OK))))
                .defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
