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
@Table(name = "Drugs", schema = "lookups")
public class Drugs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DrugPkId")
    private Long drugPkId;

    @Column(name = "Name")
    private String name;

    @Column(name = "isActive")
    private Boolean isActive;
}
