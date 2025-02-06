package com.pentavirato.calendarioModule.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "scoreboards")
public class Scoreboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer homeScore;
    private Integer guestScore;
    private Boolean isFinished;
    @ManyToOne
    private Team winner;

    public Scoreboard() {
    }

    public Scoreboard(Integer homeScore, Integer guestScore, Boolean isFinished) {
        this.homeScore = homeScore;
        this.guestScore = guestScore;
        this.isFinished = isFinished;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getHomeScore() {
        return homeScore;
    }

    public void setHomeScore(Integer homeScore) {
        this.homeScore = homeScore;
    }

    public Integer getGuestScore() {
        return guestScore;
    }

    public void setGuestScore(Integer guestScore) {
        this.guestScore = guestScore;
    }

    public Boolean getFinished() {
        return isFinished;
    }

    public void setFinished(Boolean finished) {
        isFinished = finished;
    }

    public Team getWinner() {
        return winner;
    }

    public void setWinner(Team winner) {
        this.winner = winner;
    }
}
