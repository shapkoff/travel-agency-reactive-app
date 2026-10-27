package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Booking;
import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.ArrayList;

@RestController
public class MyController{

    @GetMapping("/clients")
    public Flux<Client> getClients() {

        return Flux.just(
                        new Client(1, "Vasya", "Ivanovich", "Pypkin", "0661234577", "email1@example.com", 44, new ArrayList<>()),
                        new Client(2, "Iva", "Sergeevich", "Pypkina", "0971235423", "email2@example.com", 34, new ArrayList<>()),
                        new Client(3, "Inna", "Aleksandrovich", "Pypkina", "0954351365", "email1@example.com", 27, new ArrayList<>())
                )
                .skip(0)
                .take(2);
    }
}
