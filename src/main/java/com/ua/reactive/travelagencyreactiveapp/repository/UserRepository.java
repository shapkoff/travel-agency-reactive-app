package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.User;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends ReactiveCrudRepository<User, Long> {

    @Query("SELECT * FROM users WHERE id=:id")
    Mono<User> findById(Long id);

    @Query("SELECT id, username, password FROM users WHERE username = :username")
    Mono<User> findByUsername(String username);

}
