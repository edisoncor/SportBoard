package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {
}