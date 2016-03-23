package com.redimed.telehealth.patient.api;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.models.Appointment;

import java.util.List;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.http.Path;
import retrofit.mime.TypedFile;

/**
 * Created by Fox on 9/25/2015.
 */
public interface RegisterApi {

    /* 3001 */
    @GET("/suburb")
    void getListSuburb(Callback<JsonObject> callback);

    /* 3005 */
    @Multipart
    @POST("/api/uploadFile")
    void uploadFileModel(@Part("userUID") String userUID, @Part("fileType") String fileType, @Part("bodyPart") String bodyPart,
                         @Part("description") String description, @Part("uploadFile") TypedFile uploadFile,
                         Callback<JsonObject> callback);

    @Multipart
    @POST("/api/uploadFile")
    void uploadFile(@Part("userUID") String userUID,
                    @Part("fileType") String fileType,
                    @Part("uploadFile") TypedFile uploadFile,
                    Callback<JsonObject> callback);

    @Multipart
    @POST("/api/uploadFileWithoutLogin")
    void uploadFileNonLogin(@Part("userUID") String userUID,
                            @Part("fileType") String fileType,
                            @Part("uploadFile") TypedFile uploadFile,
                            Callback<JsonObject> callback);

    @POST("/api/telehealth/user/enableFile")
    void changeEnableFile(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/service/list")
    void getListService(Callback<JsonObject> callback);

    @GET("/api/site/list")
    void getListSite(Callback<JsonObject> callback);

    /* 3006 */
    @POST("/api/refresh-token/GetNewToken")
    void getNewToken(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/login")
    void login(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    /* 3009 */
    @POST("/api/telehealth/user/requestActivationCode")
    void activation(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/verifyActivationCode")
    void verify(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/details/{teleUID}")
    void getDetailsPatient(@Path("teleUID") String teleUID, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/appointments")
    void getTrackingReferrals(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/WAAppointmentDetails/{apptUID}")
    void getAppointmentDetails(@Path("apptUID") String apptUID, Callback<JsonObject> callback);

    @POST("/api/telehealth/appointment/updateFile")
    void addAppointmentFile(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/updateToken")
    void updateToken(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/{uid}")
    void getTelehealthUID(@Path("uid") String userID, Callback<JsonObject> callback);

    @POST("/api/telehealth/appointment/request")
    void requestTelehealth(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/update")
    void updateProfile(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/logout")
    void logout(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/telehealth/listCountry")
    void getListCountry(Callback<JsonObject> callback);
}
