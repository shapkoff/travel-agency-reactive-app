package com.ua.reactive.travelagencyreactiveapp.security;

import com.ua.reactive.travelagencyreactiveapp.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Component
public class JwtRequestFilter implements WebFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    public JwtRequestFilter(JwtTokenUtil jwtTokenUtil, UserService userService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        return authenticate(exchange)
                .map(Optional::of)
                .defaultIfEmpty(Optional.empty())
                .flatMap(auth -> {
                    Mono<Void> next = chain.filter(exchange);
                    return auth.map(authentication -> next.contextWrite(ReactiveSecurityContextHolder
                            .withAuthentication(authentication))).orElse(next);
                });
    }

    private Mono<Authentication> authenticate(ServerWebExchange exchange) {
        String header = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            return Mono.empty();
        }

        String token = header.substring(BEARER_PREFIX.length());

        return Mono.justOrEmpty(jwtTokenUtil.extractUsername(token))
                .flatMap(userService::findByUsername)
                .filter(user -> jwtTokenUtil.validateToken(token, user.getUsername()))
                .map(user -> new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }
}
