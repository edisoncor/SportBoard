package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Calendar;
import com.pentavirato.calendarioModule.repositorios.CalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/calendars")
public class CalendarController {

    @Autowired
    private CalendarRepository calendarRepository;

    @GetMapping
    public List<Calendar> getAll() {
        return calendarRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Calendar> getById(@PathVariable Long id) {
        return calendarRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Calendar> create(@RequestBody Calendar calendar) {
        return ResponseEntity.ok(calendarRepository.save(calendar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Calendar> update(@PathVariable Long id, @RequestBody Calendar calendar) {
        if (!calendarRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        calendar.setId(id);
        return ResponseEntity.ok(calendarRepository.save(calendar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!calendarRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        calendarRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
