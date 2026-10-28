package com.ua.reactive.travelagencyreactiveapp.repository;

import com.ua.reactive.travelagencyreactiveapp.entity.UserRoles;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UserRolesRepository extends ReactiveCrudRepository<UserRoles, Long> {

    @Query("SELECT role_id FROM user_roles WHERE user_id = :userId")
    Flux<Long> findRoleIdsByUserId(Long userId);

    @Query("INSERT INTO user_roles (user_id, role_id) VALUES (:userId, :roleId)")
    Mono<Void> insertUserRole(Long userId, Long roleId);
}
