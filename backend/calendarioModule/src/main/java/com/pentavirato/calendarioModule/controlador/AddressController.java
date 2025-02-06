package com.pentavirato.calendarioModule.controlador;

import com.pentavirato.calendarioModule.modelo.Address;
import com.pentavirato.calendarioModule.repositorios.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @GetMapping
    public List<Address> getAll() {
        return addressRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getById(@PathVariable Long id) {
        return addressRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Address> create(@RequestBody Address address) {
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> update(@PathVariable Long id, @RequestBody Address address) {
        if (!addressRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        address.setId(id);
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!addressRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        addressRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
