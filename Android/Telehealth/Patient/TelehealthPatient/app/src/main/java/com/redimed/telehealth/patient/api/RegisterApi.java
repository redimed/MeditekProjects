package com.redimed.telehealth.patient.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.POST;

/**
 * Created by Fox on 9/25/2015.
 */
public interface RegisterApi {
    @POST("/telehealth/user/requestActivationCode")
    void activation(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/telehealth/user/verifyActivationCode")
    void verify(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);
}
