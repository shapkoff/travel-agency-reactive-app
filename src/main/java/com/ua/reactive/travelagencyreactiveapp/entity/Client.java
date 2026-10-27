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
    @Transient
    private List<Booking> bookings = new ArrayList<>();
}
