package com.ua.reactive.travelagencyreactiveapp.service;

import com.ua.reactive.travelagencyreactiveapp.entity.Client;
import com.ua.reactive.travelagencyreactiveapp.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Flux<Client> getClients() {
        return clientRepository.findAll();
    }

    public Mono<Client> getClient(Long id) {
        return clientRepository.findById(id);
    }

    public Mono<Client> addClient(Client client) {
        return clientRepository.save(client);
    }

    public Mono<Client> updateClient(Long id, Client client) {
        return clientRepository.findById(id)
                .flatMap(c -> {
                    client.setId(c.getId());
                    return clientRepository.save(client);
                });
    }

    public Mono<Void> deleteClient(Client client) {
        return clientRepository.delete(client);
    }
}
