package com.jamsy.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AutoCarWashApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutoCarWashApplication.class, args);
	}

}
