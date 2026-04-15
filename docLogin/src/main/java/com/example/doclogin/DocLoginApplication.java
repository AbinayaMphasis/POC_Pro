package com.example.doclogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
		"com.example.doclogin.controller",
		"com.example.doclogin.model",
		"com.example.doclogin.repository"
		})

public class DocLoginApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocLoginApplication.class, args);
	}

}
