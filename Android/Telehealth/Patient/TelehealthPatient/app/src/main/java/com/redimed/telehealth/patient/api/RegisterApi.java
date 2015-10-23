package com.redimed.telehealth.patient.api;

import com.google.gson.JsonObject;

import java.io.File;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.Header;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.http.Path;
import retrofit.http.Query;
import retrofit.mime.TypedFile;

/**
 * Created by Fox on 9/25/2015.
 */
public interface RegisterApi {
//    3009: Authorization, CoreAuth
//    3005: CoreAuth

    @POST("/api/telehealth/user/requestActivationCode")
    void activation(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/verifyActivationCode")
    void verify(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/details")
    void getDetailsPatient(@Header("Authorization") String token,
                           @Header("CoreAuth") String core,
                           @Body JsonObject telehealthPatient,
                           Callback<JsonObject> callback);

    @POST("/api/telehealth/user/appointments")
    void getAppointmentPatients(@Header("Authorization") String token,
                                @Header("CoreAuth") String core,
                                @Body JsonObject telehealthPatient,
                                Callback<JsonObject> callback);

    @POST("/api/telehealth/user/appointmentDetails")
    void getAppointmentDetails(@Header("Authorization") String token,
                               @Header("CoreAuth") String core,
                               @Body JsonObject telehealthPatient,
                               Callback<JsonObject> callback);

    @Multipart
    @POST("/api/uploadFile")
    void uploadFile(@Header("Authorization") String core,
                    @Part("userUID") String accountUID,
                    @Part("fileType") String fileType,
                    @Part("bodyPart") String bodyPart,
                    @Part("description") String description,
                    @Part("uploadFile") TypedFile uploadFile,
                    Callback<JsonObject> callback);

    @POST("/api/telehealth/appointment/updateFile")
    void addAppointmentFile(@Header("Authorization") String token,
                            @Header("CoreAuth") String code,
                            @Body JsonObject telehealthPatient,
                            Callback<JsonObject> callback);
}
