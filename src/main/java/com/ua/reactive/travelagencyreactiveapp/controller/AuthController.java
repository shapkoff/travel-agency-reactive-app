package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.security.AuthRequest;
import com.ua.reactive.travelagencyreactiveapp.security.AuthResponse;
import com.ua.reactive.travelagencyreactiveapp.security.JwtTokenUtil;
import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final ReactiveAuthenticationManager authenticationManager;

    public AuthController(UserService userService,
                          JwtTokenUtil jwtTokenUtil,
                          ReactiveAuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@RequestBody AuthRequest request) {
        return userService.existsByUsername(request.getUsername())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.just(ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(new AuthResponse(null, "User already exists")));
                    }

                    User user = new User(request.getUsername(), request.getPassword());
                    return userService.registerUser(user)
                            .flatMap(savedUser -> userService.findByUsername(savedUser.getUsername()))
                            .map(userDetails -> {
                                String roles = userDetails.getAuthorities().stream()
                                        .map(Object::toString)
                                        .collect(Collectors.joining(","));
                                String token = jwtTokenUtil.generateToken(
                                        userDetails.getUsername(),
                                        Map.of("roles", roles));
                                return ResponseEntity
                                        .status(HttpStatus.CREATED)
                                        .body(new AuthResponse(token, userDetails.getUsername()));
                            });
                });
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody AuthRequest request) {
        return authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(), request.getPassword()))
                .map(authentication -> {
                    String roles = authentication.getAuthorities().stream()
                            .map(Object::toString)
                            .collect(Collectors.joining(","));
                    String token = jwtTokenUtil.generateToken(
                            authentication.getName(),
                            Map.of("roles", roles));
                    return ResponseEntity.ok(new AuthResponse(token, authentication.getName()));
                })
                .onErrorResume(e -> Mono.just(ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid credentials"))));
    }
}
