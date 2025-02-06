package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.PlayingField;
import com.pentavirato.calendarioModule.repositorios.PlayingFieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/playing-fields")
public class PlayingFieldController {

    @Autowired
    private PlayingFieldRepository playingFieldRepository;

    @GetMapping
    public List<PlayingField> getAll() {
        return playingFieldRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayingField> getById(@PathVariable Long id) {
        return playingFieldRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlayingField> create(@RequestBody PlayingField playingField) {
        return ResponseEntity.ok(playingFieldRepository.save(playingField));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayingField> update(@PathVariable Long id, @RequestBody PlayingField playingField) {
        if (!playingFieldRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playingField.setId(id);
        return ResponseEntity.ok(playingFieldRepository.save(playingField));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!playingFieldRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playingFieldRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
