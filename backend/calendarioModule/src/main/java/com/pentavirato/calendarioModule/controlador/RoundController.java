package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Round;
import com.pentavirato.calendarioModule.repositorios.RoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/rounds")
public class RoundController {

    @Autowired
    private RoundRepository roundRepository;

    @GetMapping
    public List<Round> getAll() {
        return roundRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Round> getById(@PathVariable Long id) {
        return roundRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Round> create(@RequestBody Round round) {
        return ResponseEntity.ok(roundRepository.save(round));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Round> update(@PathVariable Long id, @RequestBody Round round) {
        if (!roundRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        round.setId(id);
        return ResponseEntity.ok(roundRepository.save(round));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!roundRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roundRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
