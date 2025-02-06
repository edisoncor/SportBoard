package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.LeaderBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderBoard, Long> {
}