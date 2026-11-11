package com.ua.reactive.travelagencyreactiveapp.controller;

import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import com.ua.reactive.travelagencyreactiveapp.entity.User;
import com.ua.reactive.travelagencyreactiveapp.service.ClientService;
import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final UserService userService;

    @GetMapping
    public Flux<Client> getAllClients() {
        return clientService.getClients();
    }

    @GetMapping("/me")
    public Mono<ResponseEntity<Client>> getCurrentClient(Authentication authentication) {
        if (authentication == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        }

        return userService.findByUsername(authentication.getName())
                .cast(User.class)
                .flatMap(user -> clientService.findByUserId(user.getId())
                        .switchIfEmpty(Mono.defer(() -> {
                            Client newClient = new Client();
                            newClient.setUserId(user.getId());
                            newClient.setFirstName(user.getUsername());
                            newClient.setLastName("Користувач");
                            newClient.setEmail(user.getUsername() + "@travel.ua");
                            newClient.setDiscountPercent(0.0);
                            newClient.setIsRegular(false);
                            return clientService.addClient(newClient);
                        }))
                )
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
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

    @PatchMapping("/{id}/discount")
    public Mono<ResponseEntity<Client>> updateDiscount(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Double discount = null;
        if (body.get("discountPercent") != null) {
            discount = Double.valueOf(body.get("discountPercent").toString());
        }
        Boolean isRegular = null;
        if (body.get("isRegular") != null) {
            isRegular = Boolean.valueOf(body.get("isRegular").toString());
        }

        return clientService.updateDiscount(id, discount, isRegular)
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
