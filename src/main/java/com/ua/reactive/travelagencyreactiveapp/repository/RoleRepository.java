package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.Role;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface RoleRepository extends ReactiveCrudRepository<Role, Long> {

    @Query("SELECT * FROM roles WHERE id =:id")
    Mono<Role> findById(Long id);


    @Query("SELECT rs.id, rs.name "+
            "FROM roles rs "+
            "JOIN user_roles ur ON rs.id = ur.role_id "+
            "JOIN users u ON ur.user_id = u.id "+
            "WHERE u.id =:idd")
    Flux<Role> findByUserId(Long idd);

    @Query("SELECT * FROM roles WHERE name = :name")
    Mono<Role> findByName(String name);
}
