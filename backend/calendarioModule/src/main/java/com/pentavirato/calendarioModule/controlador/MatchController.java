package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Match;
import com.pentavirato.calendarioModule.repositorios.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @GetMapping
    public List<Match> getAll() {
        return matchRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getById(@PathVariable Long id) {
        return matchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Match> create(@RequestBody Match match) {
        return ResponseEntity.ok(matchRepository.save(match));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> update(@PathVariable Long id, @RequestBody Match match) {
        if (!matchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        match.setId(id);
        return ResponseEntity.ok(matchRepository.save(match));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!matchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        matchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
