package com.redimed.telehealth.patient.models;

/**
 * Created by Lam on 10/7/2015.
 */
public class Category {
    private int scrImg;
    private String title;
    private int icon;

    public Category(int scrImg, String title) {
        this.scrImg = scrImg;
        this.title = title;
    }

    public int getScrImg() {
        return scrImg;
    }

    public void setScrImg(int scrImg) {
        this.scrImg = scrImg;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getIcon() {
        return icon;
    }

    public void setIcon(int icon) {
        this.icon = icon;
    }
}
