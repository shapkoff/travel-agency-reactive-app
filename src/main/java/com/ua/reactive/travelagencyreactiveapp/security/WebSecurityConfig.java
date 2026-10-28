package com.ua.reactive.travelagencyreactiveapp.security;

import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http,
                                                      JwtRequestFilter jwtRequestFilter,
                                                      ReactiveAuthenticationManager authenticationManager) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/hello", "/").permitAll()

                        .pathMatchers(HttpMethod.GET, "/tours").permitAll()
                        .pathMatchers(HttpMethod.GET, "/tours/{id}").permitAll()

                        .pathMatchers(HttpMethod.POST, "/bookings").hasRole("CLIENT")
                        .pathMatchers(HttpMethod.GET, "/clients/me").hasRole("CLIENT")
                        .pathMatchers(HttpMethod.POST, "/payments").hasRole("CLIENT")

                        .pathMatchers(HttpMethod.POST, "/tours").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/tours/{id}").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.GET, "/clients/{id}").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/bookings/{id}").hasAnyRole("MANAGER", "ADMIN")

                        .pathMatchers(HttpMethod.DELETE, "/tours/**").hasRole("ADMIN")
                        .pathMatchers("/users/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers("/admin/**").hasRole("ADMIN")

                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtRequestFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .authenticationManager(authenticationManager)
                .build();
    }

    @Bean
    public ReactiveAuthenticationManager authenticationManager(UserService userService,
                                                                PasswordEncoder passwordEncoder) {
        UserDetailsRepositoryReactiveAuthenticationManager authManager =
                new UserDetailsRepositoryReactiveAuthenticationManager(userService);
        authManager.setPasswordEncoder(passwordEncoder);
        return authManager;
    }
}
