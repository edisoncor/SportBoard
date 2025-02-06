package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
}