package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.Booking;
import com.ua.reactive.travelagencyreactiveapp.entity.BookingStatus;
import com.ua.reactive.travelagencyreactiveapp.repository.BookingRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.ClientRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.HotelRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.TourRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final ClientRepository clientRepository;
    private final HotelRepository hotelRepository;

    public BookingService(BookingRepository bookingRepository,
                          TourRepository tourRepository,
                          ClientRepository clientRepository,
                          HotelRepository hotelRepository) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.clientRepository = clientRepository;
        this.hotelRepository = hotelRepository;
    }

    public Flux<Booking> getBookings() {
        return bookingRepository.findAll().flatMap(this::enrichBooking);
    }

    public Flux<Booking> getBookingsByClientId(Long clientId) {
        return bookingRepository.findByClientId(clientId).flatMap(this::enrichBooking);
    }

    public Mono<Booking> getBooking(Long id) {
        return bookingRepository.findById(id).flatMap(this::enrichBooking);
    }

    public Mono<Booking> addBooking(Booking booking) {
        return tourRepository.findById(booking.getTourId())
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Тур не знайдено")))
                .flatMap(tour -> {
                    if (tour.getSeatsAvailable() < booking.getPeopleCount()) {
                        return Mono.error(new IllegalStateException("Недостатньо вільних місць у турі"));
                    }

                    return clientRepository.findById(booking.getClientId())
                            .defaultIfEmpty(null)
                            .flatMap(client -> {
                                double discount = (client != null && client.getDiscountPercent() != null)
                                        ? client.getDiscountPercent()
                                        : (booking.getDiscountPercent() != null ? booking.getDiscountPercent() : 0.0);

                                double basePrice = tour.getPricePerPerson() * booking.getPeopleCount();
                                double finalPrice = Math.round(basePrice * (1.0 - (discount / 100.0)) * 100.0) / 100.0;

                                booking.setDiscountPercent(discount);
                                booking.setTotalPrice(finalPrice);
                                booking.setStatus(BookingStatus.NEW);

                                // update seats
                                tour.setSeatsAvailable(tour.getSeatsAvailable() - booking.getPeopleCount());

                                return tourRepository.save(tour)
                                        .then(bookingRepository.save(booking))
                                        .flatMap(this::enrichBooking);
                            });
                });
    }

    public Mono<Booking> updateBooking(Long id, Booking booking) {
        return bookingRepository.findById(id)
                .flatMap(b -> {
                    booking.setId(b.getId());
                    return bookingRepository.save(booking);
                })
                .flatMap(this::enrichBooking);
    }

    public Mono<Booking> updateStatus(Long id, BookingStatus status) {
        return bookingRepository.findById(id)
                .flatMap(booking -> {
                    booking.setStatus(status);
                    return bookingRepository.save(booking);
                })
                .flatMap(this::enrichBooking);
    }

    public Mono<Void> deleteBooking(Booking booking) {
        return bookingRepository.delete(booking);
    }

    private Mono<Booking> enrichBooking(Booking booking) {
        Mono<Void> tourMono = tourRepository.findById(booking.getTourId())
                .flatMap(tour -> {
                    if (tour.getHotelId() != null) {
                        return hotelRepository.findById(tour.getHotelId())
                                .map(h -> {
                                    tour.setHotel(h);
                                    return tour;
                                })
                                .defaultIfEmpty(tour);
                    }
                    return Mono.just(tour);
                })
                .doOnNext(booking::setTour)
                .then();

        Mono<Void> clientMono = clientRepository.findById(booking.getClientId())
                .doOnNext(booking::setClient)
                .then();

        return Mono.when(tourMono, clientMono).thenReturn(booking);
    }
}
