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

    @POST("/api/telehealth/user/requestActivationCode")
    void activation(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/verifyActivationCode")
    void verify(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/details/{teleUID}")
    void getDetailsPatient(@Path("teleUID") String teleUID, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/appointments/{patientUID}")
    void getAppointmentPatients(@Path("patientUID") String patientUID,
                                Callback<JsonObject> callback);

    @GET("/api/telehealth/user/WAAppointmentDetails/{apptUID}")
    void getAppointmentDetails(@Path("apptUID") String apptUID, Callback<JsonObject> callback);

    //3005
    @Multipart
    @POST("/api/uploadFile")
    void uploadFile(@Part("userUID") String userUID, @Part("fileType") String fileType, @Part("bodyPart") String bodyPart,
                    @Part("description") String description, @Part("uploadFile") TypedFile uploadFile,
                    Callback<JsonObject> callback);

    @POST("/api/telehealth/appointment/updateFile")
    void addAppointmentFile(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    //3006
    @POST("/api/refresh-token/GetNewToken")
    void getNewToken(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/updateToken")
    void updateToken(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    //3006
    @POST("/api/login")
    void login (@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/{uid}")
    void getTelehealthUID (@Path("uid") String userID, Callback<JsonObject> callback);

    @GET("/api/logout")
    void logout(Callback<JsonObject> callback);
}
