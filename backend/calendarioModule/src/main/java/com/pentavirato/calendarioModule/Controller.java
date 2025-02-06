package com.pentavirato.calendarioModule;

import com.pentavirato.calendarioModule.modelo.Calendar;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/calendar")
public class Controller {
    private Calendar calendarService;

    // Permitir solicitudes de cualquier origen
    @CrossOrigin(origins = "http://localhost:4200")  // Cambia este puerto si tu frontend usa otro
    @GetMapping("/hola")
    public String getHello() {
        return "Hola desde el backend!";
    }

    @CrossOrigin(origins = "http://localhost:4200")  // Cambia este puerto si tu frontend usa otro
    @GetMapping("/abel")
    public String getAbel() {
        return "Abel";
    }
}
