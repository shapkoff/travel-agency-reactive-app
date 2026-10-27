package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import com.ua.reactive.travelagencyreactiveapp.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public Flux<Client> getAllClients() {
        return clientService.getClients();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Client>> getClientById(@PathVariable Long id) {
        return clientService.getClient(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<Client> addNewClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Client>> updateClient(
            @PathVariable Long id,
            @RequestBody Client client) {
        return clientService.updateClient(id, client)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteClient(@PathVariable Long id) {
        return clientService.getClient(id)
                .flatMap(c ->
                        clientService.deleteClient(c)
                                .then(Mono.just(new ResponseEntity<Void>(HttpStatus.OK)))
                )
                .defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
