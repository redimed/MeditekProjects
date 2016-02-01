package com.redimed.telehealth.patient.api;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public class ErrorApi {
    private int statusCode;
    private String message;

    public ErrorApi() {}

    public int status() {
        return statusCode;
    }

    public String message() {
        return message;
    }
}
