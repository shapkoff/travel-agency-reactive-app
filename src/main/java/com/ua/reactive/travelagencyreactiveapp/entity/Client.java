package com.ua.reactive.travelagencyreactiveapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table("clients")
public class Client {
    @Id
    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
    private String email;
    private Integer age;
    private Long userId;
    private Double discountPercent = 0.0;
    private Boolean isRegular = false;

    @Transient
    private List<Booking> bookings = new ArrayList<>();

    // Backwards-compatible constructor for existing controllers/tests
    public Client(Long id, String firstName, String middleName, String lastName, String phone, String email, Integer age, List<Booking> bookings) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.age = age;
        this.bookings = bookings != null ? bookings : new ArrayList<>();
        this.userId = null;
        this.discountPercent = 0.0;
        this.isRegular = false;
    }
}
