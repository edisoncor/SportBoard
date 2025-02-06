package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {
}