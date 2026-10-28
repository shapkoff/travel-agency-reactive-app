package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.repository.RoleRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.UserRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.UserRolesRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashSet;

@Service
public class UserService implements ReactiveUserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRolesRepository userRolesRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       UserRolesRepository userRolesRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRolesRepository = userRolesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Flux<GrantedAuthority> getAuthorities(Long userId) {
        return
                roleRepository.findByUserId(userId)
                        .cast(GrantedAuthority.class);
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {

        return userRepository.findByUsername(username)
                .flatMap(user ->
                        getAuthorities(user.getId())
                                .collectList()
                                .map(authorities -> {
                                    user.setAuthorities(new HashSet<>(authorities));
                                    return user;
                                })
                );
    }

    public Flux<User> findAll() {
        return userRepository.findAll();
    }

    public Mono<User> registerUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user)
                .flatMap(savedUser ->
                        roleRepository.findByName("ROLE_CLIENT")
                                .switchIfEmpty(Mono.error(new RuntimeException("Default role ROLE_CLIENT not found")))
                                .flatMap(role ->
                                        userRolesRepository.insertUserRole(savedUser.getId(), role.getId())
                                                .thenReturn(savedUser)
                                )
                );
    }

    public Mono<Boolean> existsByUsername(String username) {
        return userRepository.findByUsername(username)
                .hasElement();
    }
}
