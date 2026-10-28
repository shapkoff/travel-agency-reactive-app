package com.ua.reactive.travelagencyreactiveapp.router;

import com.ua.reactive.travelagencyreactiveapp.handler.Handler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration(proxyBeanMethods = false)
public class Router {

    @Bean
    public RouterFunction<ServerResponse> route(Handler handler) {

        return RouterFunctions
                .route(RequestPredicates.GET("/hello").and(accept(MediaType.APPLICATION_JSON)), handler::home)
                .andRoute(RequestPredicates.GET("/"), handler::home)
                .andRoute(RequestPredicates.GET("/users"), handler::users)
                .andRoute(RequestPredicates.GET("/admin"), handler::admin);
    }
}
