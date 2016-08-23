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

    @GET("/suburb")
    void getListSuburb(Callback<JsonObject> callback);

    @POST("/api/login")
    void login(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @GET("/api/logout")
    void logout(Callback<JsonObject> callback);

    @POST("/api/refresh-token/GetNewToken")
    void getNewToken(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @Multipart
    @POST("/api/uploadFile")
    void uploadFile(@Part("userUID") String userUID,
                    @Part("fileType") String fileType,
                    @Part("uploadFile") TypedFile uploadFile,
                    Callback<JsonObject> callback);


    // get function
    @GET("/api/workinjury/get-list-staff/{userUid}")
    void getListStaff(@Path("userUid") String userUid, Callback<JsonObject> callback);

    @GET("/api/workinjury/detail-company-by-user/{userUid}")
    void getDetailCompany(@Path("userUid") String userUid, Callback<JsonObject> callback);

    @GET("/api/workinjury/get-list-site/{companyUid}")
    void getListSite(@Path("companyUid") String companyUid, Callback<JsonObject> callback);

    @GET("/api/workinjury/user/details/{uid}=")
    void getDetailAccount(@Query("uid") String uid, Callback<JsonObject> callback);



    // post function
    @POST("/api/workinjury/checkActivation")
    void checkActivation(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/appointment-request-patient")
    void sendAppointmentNew(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/user")
    void getTelehealthUser(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/user/forgetPin")
    void forgetPin(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/detail-patient")
    void getDetailPatient(@Body JsonObject object, Callback<JsonObject> callback);

    @POST("/api/workinjury/load-detail-company")
    void getDetailSite(@Body JsonObject object, Callback<JsonObject> callback);

    @POST("/api/workinjury/updatePinNumber")
    void updatePin(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/user/update")
    void updatePatient(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/appointment-request-company")
    void makeAppointmentCompany(@Body JsonObject jsonObject, Callback<JsonObject> callback);

    @POST("/api/workinjury/eform-redisite")
    void submitRedisite(@Body JsonObject jsonObject, Callback<JsonObject> callback);
}
