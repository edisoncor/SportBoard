package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoundRepository extends JpaRepository<Round, Long> {
}