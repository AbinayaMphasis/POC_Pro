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
@Table(name = "Prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MedicationName")
    private String medicationName;

    @Column(name = "Dosage")
    private String dosage;

    @Column(name = "Frequency")
    private String frequency;

    @Column(name = "Duration")
    private String duration;

    @Column(name = "PrescriberSigned")
    private Boolean prescriberSigned;

    @Column(name = "DateSigned")
    private String dateSigned;
}
