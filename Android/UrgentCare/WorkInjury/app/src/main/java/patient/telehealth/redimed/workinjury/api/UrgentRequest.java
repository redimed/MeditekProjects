package patient.telehealth.redimed.workinjury.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.http.Path;
import retrofit.http.Query;
import retrofit.mime.TypedFile;

/**
 * Created by Lam on 11/3/2015.
 */
public interface UrgentRequest {
    @POST("/urgent-request")
    void sendUrgentRequest(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/suburb")
    void getListSuburb(Callback<JsonObject> callback);

    @POST("/api/telehealth/checkActivation")
    void checkActivation(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/login")
    void login(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/logout")
    void logout(Callback<JsonObject> callback);

    @POST("/api/refresh-token/GetNewToken")
    void getNewToken(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/company/get-list-staff/{userUid}")
    void getListStaff(@Path("userUid") String userUid, Callback<JsonObject> callback);

    @GET("/api/company/detail-company-by-user/{userUid}")
    void getDetailCompany(@Path("userUid") String userUid, Callback<JsonObject> callback);

    @GET("/api/company/get-list-site/{companyUid}")
    void getListSite(@Path("companyUid") String companyUid, Callback<JsonObject> callback);

    @GET("/api/user-account/GetUserAccountDetails?UID=")
    void getDetailUser(@Query("userUid") String userUid, Callback<JsonObject> callback);

    @GET("/api/telehealth/user/details/{uid}=")
    void getDetailAccount(@Query("uid") String uid, Callback<JsonObject> callback);

    @POST("/api/telehealth/appointment/request")
    void sendAppointment(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/appointment-wa-request/patient-new")
    void sendAppointmentNew(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/sendCoreServer")
    void sendCoreServer(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user")
    void getTelehealthUser(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/forgetPin")
    void forgetPin(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/patient/detail-patient")
    void getDetailPatient(@Body JsonObject object, Callback<JsonObject> callback);

    @POST("/api/company/load-detail")
    void getDetailSite(@Body JsonObject object, Callback<JsonObject> callback);

    @POST("/api/telehealth/updatePinNumber")
    void updatePin(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/user/update")
    void updatePatient(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/telehealth/appointment/updateFile")
    void addAppointmentFile(@Body JsonObject telehealthPatient, Callback<JsonObject> callback);

    /* 3005 */
    @Multipart
    @POST("/api/uploadFile")
    void uploadFileModel(@Part("userUID") String userUID, @Part("fileType") String fileType, @Part("bodyPart") String bodyPart,
                         @Part("description") String description, @Part("uploadFile") TypedFile uploadFile,
                         Callback<JsonObject> callback);

    @GET("/api/telehealth/user/WAAppointmentDetails/{apptUID}")
    void getAppointmentDetails(@Path("apptUID") String apptUID, Callback<JsonObject> callback);
}
