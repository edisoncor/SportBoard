package com.pentavirato.calendarioModule.repositorios;

import com.pentavirato.calendarioModule.modelo.PlayingField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayingFieldRepository extends JpaRepository<PlayingField, Long> {
}