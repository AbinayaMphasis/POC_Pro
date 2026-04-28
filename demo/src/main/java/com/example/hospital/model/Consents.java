package com.example.hospital.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Consents")
public class Consents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    // 1 = Patient Consent, 2 = Physician Consent
    @Column(name = "ConsentType")
    private Integer consentType;
    @Column(name = "ConsentGiven")
    private Boolean consentGiven;
    @Column(name = "DateOfConsent")
    private String dateOfConsent;
}
