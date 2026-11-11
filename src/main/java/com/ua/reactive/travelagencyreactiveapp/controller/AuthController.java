package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.security.AuthRequest;
import com.ua.reactive.travelagencyreactiveapp.security.AuthResponse;
import com.ua.reactive.travelagencyreactiveapp.security.JwtTokenUtil;
import com.ua.reactive.travelagencyreactiveapp.service.ClientService;
import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final ClientService clientService;
    private final JwtTokenUtil jwtTokenUtil;
    private final ReactiveAuthenticationManager authenticationManager;

    public AuthController(UserService userService,
                          ClientService clientService,
                          JwtTokenUtil jwtTokenUtil,
                          ReactiveAuthenticationManager authenticationManager) {
        this.userService = userService;
        this.clientService = clientService;
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
                            .flatMap(savedUser ->
                                    userService.findByUsername(savedUser.getUsername())
                                            .cast(User.class)
                                            .flatMap(userDetails -> {
                                                Client client = new Client();
                                                client.setUserId(userDetails.getId());
                                                client.setFirstName(userDetails.getUsername());
                                                client.setLastName("Клієнт");
                                                client.setEmail(userDetails.getUsername() + "@travel.ua");
                                                client.setDiscountPercent(0.0);
                                                client.setIsRegular(false);

                                                return clientService.addClient(client)
                                                        .map(savedClient -> {
                                                            List<String> roleList = userDetails.getAuthorities().stream()
                                                                    .map(GrantedAuthority::getAuthority)
                                                                    .collect(Collectors.toList());
                                                            String rolesStr = String.join(",", roleList);
                                                            String token = jwtTokenUtil.generateToken(
                                                                    userDetails.getUsername(),
                                                                    Map.of("roles", rolesStr));
                                                            return ResponseEntity
                                                                    .status(HttpStatus.CREATED)
                                                                    .body(new AuthResponse(token, userDetails.getUsername(), roleList, userDetails.getId(), savedClient.getId()));
                                                        });
                                            })
                            );
                });
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody AuthRequest request) {
        return authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(), request.getPassword()))
                .flatMap(authentication ->
                        userService.findByUsername(authentication.getName())
                                .cast(User.class)
                                .flatMap(user -> {
                                    List<String> roleList = authentication.getAuthorities().stream()
                                            .map(GrantedAuthority::getAuthority)
                                            .collect(Collectors.toList());
                                    String rolesStr = String.join(",", roleList);
                                    String token = jwtTokenUtil.generateToken(
                                            authentication.getName(),
                                            Map.of("roles", rolesStr));

                                    return clientService.findByUserId(user.getId())
                                            .map(client -> new AuthResponse(token, authentication.getName(), roleList, user.getId(), client.getId()))
                                            .defaultIfEmpty(new AuthResponse(token, authentication.getName(), roleList, user.getId(), null));
                                })
                )
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid credentials"))));
    }
}
