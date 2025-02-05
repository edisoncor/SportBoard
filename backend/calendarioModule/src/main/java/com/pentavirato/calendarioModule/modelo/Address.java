package com.pentavirato.calendarioModule.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String principalStreet;
    private String secondaryStreet;
    private String reference;

    public Address() {
    }

    public Address(String principalStreet, String secondaryStreet, String reference) {
        this.principalStreet = principalStreet;
        this.secondaryStreet = secondaryStreet;
        this.reference = reference;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPrincipalStreet() {
        return principalStreet;
    }

    public void setPrincipalStreet(String principalStreet) {
        this.principalStreet = principalStreet;
    }

    public String getSecondaryStreet() {
        return secondaryStreet;
    }

    public void setSecondaryStreet(String secondaryStreet) {
        this.secondaryStreet = secondaryStreet;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }
}
