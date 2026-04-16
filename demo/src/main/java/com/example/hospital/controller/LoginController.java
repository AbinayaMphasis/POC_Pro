package com.example.hospital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.model.User;
import com.example.hospital.service.UserService;

@RestController
@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequestMapping("/api/auth")
public class LoginController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) {
		if (userService.authenticate(user.getUsername(), user.getPassword())) {
			User authenticatedUser = userService.findByUsername(user.getUsername());
			return ResponseEntity.ok(authenticatedUser);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}
	}
	
	@PostMapping("/create-user")
	public ResponseEntity<?> createUser(@RequestBody User user) {
		try {
			User existingUser = userService.findByUsername(user.getUsername());
			if (existingUser != null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
			}
			User createdUser = userService.createUser(user);
			return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating user: " + e.getMessage());
		}
	}
	
}
