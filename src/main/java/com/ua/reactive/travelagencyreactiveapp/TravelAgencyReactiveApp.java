package com.ua.reactive.travelagencyreactiveapp;

import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.repository.ClientRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.RoleRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.UserRepository;
import com.ua.reactive.travelagencyreactiveapp.repository.UserRolesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import reactor.core.publisher.Mono;

@SpringBootApplication
public class TravelAgencyReactiveApp {

    public static void main(String[] args) {
        SpringApplication.run(TravelAgencyReactiveApp.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      RoleRepository roleRepository,
                                      UserRolesRepository userRolesRepository,
                                      ClientRepository clientRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Manager
            userRepository.findByUsername("manager")
                    .switchIfEmpty(Mono.defer(() -> {
                        User manager = new User("manager", passwordEncoder.encode("manager123"));
                        return userRepository.save(manager)
                                .flatMap(savedUser ->
                                        roleRepository.findByName("ROLE_MANAGER")
                                                .flatMap(role -> userRolesRepository.insertUserRole(savedUser.getId(), role.getId()))
                                                .thenReturn(savedUser)
                                );
                    }))
                    .subscribe();

            // Seed Admin
            userRepository.findByUsername("admin")
                    .switchIfEmpty(Mono.defer(() -> {
                        User admin = new User("admin", passwordEncoder.encode("admin123"));
                        return userRepository.save(admin)
                                .flatMap(savedUser ->
                                        roleRepository.findByName("ROLE_ADMIN")
                                                .flatMap(role -> userRolesRepository.insertUserRole(savedUser.getId(), role.getId()))
                                                .thenReturn(savedUser)
                                );
                    }))
                    .subscribe();

            // Seed Client
            userRepository.findByUsername("olena")
                    .switchIfEmpty(Mono.defer(() -> {
                        User clientUser = new User("olena", passwordEncoder.encode("client123"));
                        return userRepository.save(clientUser)
                                .flatMap(savedUser ->
                                        roleRepository.findByName("ROLE_CLIENT")
                                                .flatMap(role -> userRolesRepository.insertUserRole(savedUser.getId(), role.getId()))
                                                .flatMap(v -> {
                                                    Client c = new Client();
                                                    c.setUserId(savedUser.getId());
                                                    c.setFirstName("Олена");
                                                    c.setLastName("Коваленко");
                                                    c.setEmail("olena.kovalenko@example.com");
                                                    c.setPhone("+380501234567");
                                                    c.setDiscountPercent(10.0);
                                                    c.setIsRegular(true);
                                                    return clientRepository.save(c);
                                                })
                                                .thenReturn(savedUser)
                                );
                    }))
                    .subscribe();
        };
    }
}
