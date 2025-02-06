package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Scoreboard;
import com.pentavirato.calendarioModule.repositorios.ScoreboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/scoreboards")
public class ScoreboardController {

    @Autowired
    private ScoreboardRepository scoreboardRepository;

    @GetMapping
    public List<Scoreboard> getAll() {
        return scoreboardRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scoreboard> getById(@PathVariable Long id) {
        return scoreboardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Scoreboard> create(@RequestBody Scoreboard scoreboard) {
        return ResponseEntity.ok(scoreboardRepository.save(scoreboard));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scoreboard> update(@PathVariable Long id, @RequestBody Scoreboard scoreboard) {
        if (!scoreboardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        scoreboard.setId(id);
        return ResponseEntity.ok(scoreboardRepository.save(scoreboard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!scoreboardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        scoreboardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
