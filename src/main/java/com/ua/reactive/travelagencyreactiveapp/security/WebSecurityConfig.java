package com.ua.reactive.travelagencyreactiveapp.security;

import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http,
                                                      JwtRequestFilter jwtRequestFilter,
                                                      ReactiveAuthenticationManager authenticationManager) {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/hello", "/").permitAll()

                        .pathMatchers(HttpMethod.GET, "/tours/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/hotels/**").permitAll()

                        .pathMatchers(HttpMethod.POST, "/bookings").authenticated()
                        .pathMatchers(HttpMethod.GET, "/bookings/my").authenticated()
                        .pathMatchers(HttpMethod.GET, "/clients/me").authenticated()
                        .pathMatchers(HttpMethod.POST, "/payments").authenticated()

                        .pathMatchers(HttpMethod.POST, "/tours").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/tours/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/tours/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/tours/**").hasAnyRole("MANAGER", "ADMIN")

                        .pathMatchers(HttpMethod.POST, "/hotels").hasAnyRole("MANAGER", "ADMIN")

                        .pathMatchers(HttpMethod.GET, "/clients").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.GET, "/clients/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/clients/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/clients/**").hasAnyRole("MANAGER", "ADMIN")

                        .pathMatchers(HttpMethod.GET, "/bookings").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/bookings/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/bookings/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/bookings/**").hasAnyRole("MANAGER", "ADMIN")

                        .pathMatchers(HttpMethod.GET, "/payments/**").hasAnyRole("MANAGER", "ADMIN", "CLIENT")

                        .pathMatchers("/users/**").hasAnyRole("MANAGER", "ADMIN")
                        .pathMatchers("/admin/**").hasRole("ADMIN")

                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtRequestFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .authenticationManager(authenticationManager)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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
