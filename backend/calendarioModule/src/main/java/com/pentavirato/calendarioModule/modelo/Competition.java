package com.pentavirato.calendarioModule.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "competitions")
public class Competition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private Date startDate;
    @OneToMany
    private List<MatchOrganization> matchOrganizations = new ArrayList<>();

    public Competition() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public List<MatchOrganization> getMatchOrganizations() {
        return matchOrganizations;
    }

    public void setMatchOrganizations(List<MatchOrganization> matchOrganizations) {
        this.matchOrganizations = matchOrganizations;
    }
}
