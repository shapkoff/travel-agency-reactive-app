package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.BookingStatus;
import com.ua.reactive.travelagencyreactiveapp.entity.Payment;
import com.ua.reactive.travelagencyreactiveapp.repository.BookingRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public Flux<Payment> getPayments() {
        return paymentRepository.findAll();
    }

    public Mono<Payment> getPayment(Long id) {
        return paymentRepository.findById(id);
    }

    public Mono<Payment> addPayment(Payment payment) {
        if (payment.getPaidAt() == null) {
            payment.setPaidAt(LocalDateTime.now());
        }

        return paymentRepository.save(payment)
                .flatMap(savedPayment ->
                        bookingRepository.findById(payment.getBookingId())
                                .flatMap(booking -> {
                                    booking.setStatus(BookingStatus.PAID);
                                    return bookingRepository.save(booking);
                                })
                                .thenReturn(savedPayment)
                );
    }

    public Mono<Payment> updatePayment(Long id, Payment payment) {
        return paymentRepository.findById(id)
                .flatMap(p -> {
                    payment.setId(p.getId());
                    return paymentRepository.save(payment);
                });
    }

    public Mono<Void> deletePayment(Payment payment) {
        return paymentRepository.delete(payment);
    }
}
