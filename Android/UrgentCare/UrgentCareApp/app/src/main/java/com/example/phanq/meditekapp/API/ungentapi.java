package com.example.phanq.meditekapp.API;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;

/**
 * Created by phanq on 09/18/2015.
 */
public interface ungentapi {
    @POST("/request")
    public void getPeed( @Body JsonObject obj, Callback<JsonObject> response);

    @GET("/test")
    public void getTest(Callback<JsonObject> response);
}
