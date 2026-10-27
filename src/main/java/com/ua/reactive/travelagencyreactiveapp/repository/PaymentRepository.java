package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.Payment;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface PaymentRepository extends ReactiveCrudRepository<Payment, Long>{
}
