package com.example.hospital.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.service.LookupService;

@CrossOrigin(allowedHeaders = "*", origins = "*")
@RestController
@RequestMapping("/api/v1")
public class LookupController {

    @Autowired
    private LookupService lookupService;

    /**
     * Accepts a list of table/entity names and returns values from each table.
     *
     * Example request body:  ["ServiceType", "Drugs", "ConsentType"]
     * Example response:
     * {
     *   "ServiceType": [ ... ],
     *   "Drugs": [ ... ],
     *   "ConsentType": [ ... ]
     * }
     */
    @PostMapping("/lookups")
    public ResponseEntity<Map<String, Object>> getLookupData(@RequestBody List<String> tableNames) {
        Map<String, Object> result = lookupService.fetchLookupData(tableNames);
        return ResponseEntity.ok(result);
    }
}
