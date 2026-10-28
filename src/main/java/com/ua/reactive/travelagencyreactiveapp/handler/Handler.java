package com.ua.reactive.travelagencyreactiveapp.handler;

import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Scanner;

@Component
public class Handler {

    private final UserService userService;

    public Handler(UserService userService) {
        this.userService = userService;
    }

    public Mono<ServerResponse> home(ServerRequest request) {
        return ServerResponse
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue("Welcome to Travel Agency"));
    }

    public Mono<ServerResponse> login(ServerRequest request) {
        return ServerResponse
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue("Login page"));
    }

    public Mono<ServerResponse> register(ServerRequest request) {
        return ServerResponse
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue("Register page"));
    }

    public Mono<ServerResponse> users(ServerRequest request){
        return ServerResponse
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue("User's Page"));
    }

    public Mono<ServerResponse> admin(ServerRequest request) {

        Flux<User> users = userService.findAll();

        return ServerResponse
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(users, User.class);
    }

}
