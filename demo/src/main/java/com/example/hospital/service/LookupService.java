package com.example.hospital.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.metamodel.EntityType;

import org.springframework.stereotype.Service;

@Service
public class LookupService {

    @PersistenceContext
    private EntityManager entityManager;

    private final Map<String, Class<?>> entityRegistry = new HashMap<>();

    @PostConstruct
    public void init() {
        // Build a registry mapping entity simple name (case-insensitive) to entity class
        for (EntityType<?> entityType : entityManager.getMetamodel().getEntities()) {
            entityRegistry.put(entityType.getName().toLowerCase(), entityType.getJavaType());
        }
    }

    /**
     * Fetches all records from each requested lookup table.
     *
     * @param tableNames list of entity/table names, e.g. ["ServiceType", "Drugs"]
     * @return map of table name -> list of records
     */
    public Map<String, Object> fetchLookupData(List<String> tableNames) {
        Map<String, Object> result = new LinkedHashMap<>();

        for (String tableName : tableNames) {
            Class<?> entityClass = entityRegistry.get(tableName.toLowerCase());

            if (entityClass != null) {
                List<?> records = entityManager
                        .createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e")
                        .getResultList();
                result.put(tableName, records);
            } else {
                result.put(tableName, "Unknown table: " + tableName);
            }
        }

        return result;
    }
}
