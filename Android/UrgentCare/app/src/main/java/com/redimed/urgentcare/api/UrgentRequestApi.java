package com.redimed.urgentcare.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;

/**
 * Created by phanq on 09/23/2015.
 */
public interface UrgentRequestApi {
    @POST("/urgent-request")
//    @POST("/request")
    public void sendUrgentRequest( @Body JsonObject obj, Callback<JsonObject> response);

    @GET("/urgent-confirm/20")
    public void getTest(Callback<JsonObject> response);
}
