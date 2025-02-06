package com.pentavirato.calendarioModule.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "leaderboards")
public class Leaderboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Competition competition;
    private Date lastUpdate;
    @OneToMany
    private List<Match> resultList = new ArrayList<>();

    public Leaderboard() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Competition getCompetition() {
        return competition;
    }

    public void setCompetition(Competition competition) {
        this.competition = competition;
    }

    public Date getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public List<Match> getResultList() {
        return resultList;
    }

    public void setResultList(List<Match> resultList) {
        this.resultList = resultList;
    }
}
