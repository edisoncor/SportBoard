package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Competition;
import com.pentavirato.calendarioModule.repositorios.CompetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/competitions")
public class CompetitionController {

    @Autowired
    private CompetitionRepository competitionRepository;

    @GetMapping
    public List<Competition> getAll() {
        return competitionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Competition> getById(@PathVariable Long id) {
        return competitionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Competition> create(@RequestBody Competition competition) {
        return ResponseEntity.ok(competitionRepository.save(competition));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Competition> update(@PathVariable Long id, @RequestBody Competition competition) {
        if (!competitionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        competition.setId(id);
        return ResponseEntity.ok(competitionRepository.save(competition));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!competitionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        competitionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
