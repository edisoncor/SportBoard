package com.pentavirato.calendarioModule.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "match_organizations")
public class MatchOrganization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    private String phase;
    @Enumerated(EnumType.STRING)
    private Method method;
    @ManyToOne
    private Leaderboard positionTable;
    @ManyToOne
    private Competition competition;
    @ManyToMany
    private List<Team> activeTeams = new ArrayList<>();
    @OneToMany
    private List<Match> matches = new ArrayList<>();

    public MatchOrganization() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public Leaderboard getPositionTable() {
        return positionTable;
    }

    public void setPositionTable(Leaderboard positionTable) {
        this.positionTable = positionTable;
    }

    public Competition getCompetition() {
        return competition;
    }

    public void setCompetition(Competition competition) {
        this.competition = competition;
    }

    public List<Team> getActiveTeams() {
        return activeTeams;
    }

    public void setActiveTeams(List<Team> activeTeams) {
        this.activeTeams = activeTeams;
    }

    public List<Match> getMatches() {
        return matches;
    }

    public void setMatches(List<Match> matches) {
        this.matches = matches;
    }
}
