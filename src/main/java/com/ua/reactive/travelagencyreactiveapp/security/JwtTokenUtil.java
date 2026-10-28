package com.ua.reactive.travelagencyreactiveapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    private final SecretKey key;
    private final Duration expiration;

    public JwtTokenUtil(@Value("${jwt.secret}") String base64Secret,
                        @Value("${jwt.expiration:1h}") Duration expiration) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
        this.expiration = expiration;
    }

    public String generateToken(String username) {
        return generateToken(username, Map.of());
    }

    public String generateToken(String username, Map<String, Object> extraClaims) {
        Date now = new Date();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(username)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration.toMillis()))
                .signWith(key) // алгоритм HS512 выбирается автоматически по длине ключа
                .compact();
    }

    public boolean validateToken(String token, String username) {
        return extractClaims(token)
                .map(claims -> username.equals(claims.getSubject()))
                .orElse(false);
    }

    public Optional<String> extractUsername(String token) {
        return extractClaims(token).map(Claims::getSubject);
    }

    public <T> Optional<T> extractClaim(String token, Function<Claims, T> resolver) {
        return extractClaims(token).map(resolver);
    }

    private Optional<Claims> extractClaims(String token) {
        try {
            return Optional.of(Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload());
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
