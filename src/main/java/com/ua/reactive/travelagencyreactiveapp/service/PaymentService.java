package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.Payment;
import com.ua.reactive.travelagencyreactiveapp.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Flux<Payment> getPayments() {
        return paymentRepository.findAll();
    }

    public Mono<Payment> getPayment(Long id) {
        return paymentRepository.findById(id);
    }

    public Mono<Payment> addPayment(Payment payment) {
        return paymentRepository.save(payment);
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
