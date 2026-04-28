package com.example.hospital.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "FirstName")
    private String firstName;
    @Column(name = "LastName")
    private String lastName;
    @Column(name = "DateOfBirth")
    private String dateOfBirth;
    @Column(name = "Gender")
    private String gender;
    @Column(name = "ContactNumber")
    private String contactNumber;
    @Column(name = "Email")
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "AddressId", referencedColumnName = "Id")
    private Address address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "AlternateContactId", referencedColumnName = "Id")
    private AlternateContact alternateContact;
}
