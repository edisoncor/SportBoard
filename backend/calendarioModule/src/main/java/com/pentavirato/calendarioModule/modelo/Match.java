package com.pentavirato.calendarioModule.modelo;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    private Time startTime;
    @ManyToOne
    private Team homeTeam;
    @ManyToOne
    private Team guestTeam;
    private Integer duration;
    private Time finishTime;
    @OneToOne
    private Scoreboard scoreboard;
    @ManyToOne
    private PlayingField count;
    @Enumerated(EnumType.STRING)
    private Status status;

    public Match() {
    }

    public Match(Date date, Time startTime, Team homeTeam, Team guestTeam, Integer duration, PlayingField count, Status status) {
        this.date = date;
        this.startTime = startTime;
        this.homeTeam = homeTeam;
        this.guestTeam = guestTeam;
        this.duration = duration;
        this.count = count;
        this.status = status;
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

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Team getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(Team homeTeam) {
        this.homeTeam = homeTeam;
    }

    public Team getGuestTeam() {
        return guestTeam;
    }

    public void setGuestTeam(Team guestTeam) {
        this.guestTeam = guestTeam;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Time getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(Time finishTime) {
        this.finishTime = finishTime;
    }

    public Scoreboard getScoreboard() {
        return scoreboard;
    }

    public void setScoreboard(Scoreboard scoreboard) {
        this.scoreboard = scoreboard;
    }

    public PlayingField getCount() {
        return count;
    }

    public void setCount(PlayingField count) {
        this.count = count;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
