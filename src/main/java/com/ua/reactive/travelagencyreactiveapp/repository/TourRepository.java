package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.Tour;
import com.ua.reactive.travelagencyreactiveapp.entity.TourType;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface TourRepository extends ReactiveCrudRepository<Tour, Long> {

    Flux<Tour> findByBurningTour(boolean burningTour);

    Flux<Tour> findByTourType(TourType tourType);

    Flux<Tour> findByTourTypeAndBurningTour(TourType tourType, boolean burningTour);
}
