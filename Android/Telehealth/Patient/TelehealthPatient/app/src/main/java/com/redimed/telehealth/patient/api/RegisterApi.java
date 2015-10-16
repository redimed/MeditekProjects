package com.redimed.telehealth.patient.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.Header;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.mime.TypedFile;

/**
 * Created by Fox on 9/25/2015.
 */
public interface RegisterApi {
    @POST("/api/telehealth/user/requestActivationCode")
    void activation(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/verifyActivationCode")
    void verify(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/details")
    void getDetailsPatient(@Body JsonObject telehealthPatient, @Header("Authorization") String token, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/appointments")
    void getAppointmentPatients(@Body JsonObject telehealthPatient, @Header("Authorization") String token, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/appointmentDetails")
    void getAppointmentDetails(@Body JsonObject telehealthPatient, @Header("Authorization") String token, Callback<JsonObject> callback);

    @Multipart
    @POST("/api/UploadSingleFileTelehealth")
    void uploadFile(@Part("uploadFile") TypedFile uploadFile,
                    @Part("fileType") String fileType,
                    @Part("patientUID") String patientUID,
                    Callback<JsonObject> callback);
}
