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
@Table(name = "AlternateContact")
public class AlternateContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "AltContactName")
    private String altContactName;
    @Column(name = "Relationship")
    private String relationship;
    @Column(name = "AltContactNumber")
    private String altContactNumber;
    @Column(name = "AltContactEmail")
    private String altContactEmail;
}
