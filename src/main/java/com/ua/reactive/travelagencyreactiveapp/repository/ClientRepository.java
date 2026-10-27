package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface ClientRepository extends ReactiveCrudRepository<Client, Long> {
}
