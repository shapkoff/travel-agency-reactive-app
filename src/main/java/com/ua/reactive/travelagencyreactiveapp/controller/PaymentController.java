package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Payment;
import com.ua.reactive.travelagencyreactiveapp.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public Flux<Payment> getAllPayments() {
        return paymentService.getPayments();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Payment>> getPaymentById(@PathVariable Long id) {
        return paymentService.getPayment(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<Payment> addNewPayment(@RequestBody Payment payment) {
        return paymentService.addPayment(payment);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Payment>> updatePayment(
            @PathVariable Long id,
            @RequestBody Payment payment) {
        return paymentService.updatePayment(id, payment)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deletePayment(@PathVariable Long id) {
        return paymentService.getPayment(id)
                .flatMap(p ->
                        paymentService.deletePayment(p)
                                .then(Mono.just(new ResponseEntity<Void>(HttpStatus.OK)))
                )
                .defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
