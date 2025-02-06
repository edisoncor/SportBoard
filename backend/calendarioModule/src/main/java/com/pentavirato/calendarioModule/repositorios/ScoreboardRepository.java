package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.Scoreboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreboardRepository extends JpaRepository<Scoreboard, Long> {
}