package com.redimed.telehealth.patient.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.Header;
import retrofit.http.POST;

/**
 * Created by Fox on 9/25/2015.
 */
public interface RegisterApi {
    @POST("/telehealth/user/requestActivationCode")
    void activation(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/telehealth/user/verifyActivationCode")
    void verify(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/telehealth/user/details")
    void getDetailsPatient(@Body JsonObject telehealthPatient, @Header("Authorization") String token, Callback<JsonObject> callback);
}
