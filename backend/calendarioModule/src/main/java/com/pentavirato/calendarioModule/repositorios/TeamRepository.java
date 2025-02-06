package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}