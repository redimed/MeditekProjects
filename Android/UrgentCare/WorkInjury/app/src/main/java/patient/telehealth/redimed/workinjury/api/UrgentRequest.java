package patient.telehealth.redimed.workinjury.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.Path;
import retrofit.http.Query;

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
}
