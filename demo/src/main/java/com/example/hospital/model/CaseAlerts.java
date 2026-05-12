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
@Table(name = "CaseAlerts")
public class CaseAlerts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "CasedataId")
    private long caseDataId;
    @Column(name = "alerttype")
    private String alertType;
    @Column(name = "alertmessage")
    private String alertmessage;
    @Column(name = "isActive")
    private Boolean isActive;
    

   
   
}
