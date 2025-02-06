package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Team;
import com.pentavirato.calendarioModule.repositorios.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping
    public List<Team> getAll() {
        return teamRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getById(@PathVariable Long id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Team> create(@RequestBody Team team) {
        return ResponseEntity.ok(teamRepository.save(team));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> update(@PathVariable Long id, @RequestBody Team team) {
        if (!teamRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        team.setId(id);
        return ResponseEntity.ok(teamRepository.save(team));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!teamRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        teamRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/equipos")

    public List<String> getEquipos() {
        return Arrays.asList("Milan", "Inter", "Juventus", "Roma", "Napoli", "Lazio", "Fiorentina", "Atalanta", "Torino", "Sampdoria", "Genoa", "Bologna", "Udinese", "Cagliari", "Sassuolo", "Parma", "Verona", "Spezia", "Benevento", "Crotone");
    }
}
