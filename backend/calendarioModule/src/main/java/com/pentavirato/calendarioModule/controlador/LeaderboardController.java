package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Leaderboard;
import com.pentavirato.calendarioModule.repositorios.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/leaderboards")
public class LeaderboardController {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @GetMapping
    public List<Leaderboard> getAll() {
        return leaderboardRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Leaderboard> getById(@PathVariable Long id) {
        return leaderboardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Leaderboard> create(@RequestBody Leaderboard leaderboard) {
        return ResponseEntity.ok(leaderboardRepository.save(leaderboard));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Leaderboard> update(@PathVariable Long id, @RequestBody Leaderboard leaderboard) {
        if (!leaderboardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leaderboard.setId(id);
        return ResponseEntity.ok(leaderboardRepository.save(leaderboard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!leaderboardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leaderboardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
