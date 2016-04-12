package patient.telehealth.redimed.workinjury.api;

import com.google.gson.JsonObject;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;

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
}
