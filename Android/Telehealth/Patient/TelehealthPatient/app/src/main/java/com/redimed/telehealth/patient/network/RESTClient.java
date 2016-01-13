package com.redimed.telehealth.patient.network;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.squareup.okhttp.OkHttpClient;
import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.concurrent.TimeUnit;
import retrofit.Callback;
import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Header;
import retrofit.client.OkClient;
import retrofit.client.Request;
import retrofit.client.Response;

/**
 * Created by luann on 9/23/2015.
 */
public class RESTClient {
    private static Context context;
    private static JsonObject dataRefresh;
    private static String TAG = "RESTCLIENT";
    private static OkHttpClient okHttpClient;
    private static SharedPreferences.Editor editor;
    private static SharedPreferences spDevice, uidTelehealth;
    private static RestAdapter restAdapter, restAdapterCore, restAdapterLogin;


    public static void InitRESTClient(Context ctx) {
        context = ctx;
        spDevice = context.getSharedPreferences("DeviceInfo", context.MODE_PRIVATE);
        uidTelehealth = context.getSharedPreferences("TelehealthUser", context.MODE_PRIVATE);
        setupRestClient();
    }

    private static void setupRestClient() {
        okHttpClient = new OkHttpClient();
        okHttpClient.setReadTimeout(30, TimeUnit.SECONDS);
        okHttpClient.setConnectTimeout(30, TimeUnit.SECONDS);

        CookieManager cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
        okHttpClient.setCookieHandler(cookieManager);

        //3009
        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURL)
                .setClient(new InterceptingOkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();

        //3005
        restAdapterCore = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURLCore)
                .setClient(new InterceptingOkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();

        //3006
        restAdapterLogin = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURLLogin)
                .setClient(new InterceptingOkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();
    }

    public static class SessionRequestInterceptor implements RequestInterceptor {
        public void intercept(RequestInterceptor.RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("SystemType", "ARD");
            paramRequestFacade.addHeader("DeviceID", spDevice.getString("deviceID", null));
            paramRequestFacade.addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", null));
            paramRequestFacade.addHeader("UserUID", uidTelehealth.getString("userUID", null));
            paramRequestFacade.addHeader("Cookie", uidTelehealth.getString("cookie", null));
            paramRequestFacade.addHeader("AppID", "com.redimed.telehealth.patient");
        }
    }

    public static RegisterApi getRegisterApi() {
        return restAdapter.create(RegisterApi.class);
    }

    public static RegisterApi getRegisterApiCore() {
        return restAdapterCore.create(RegisterApi.class);
    }

    public static RegisterApi getRegisterApiLogin() {
        return restAdapterLogin.create(RegisterApi.class);
    }

    public static class InterceptingOkClient extends OkClient
    {
        public InterceptingOkClient(OkHttpClient client) {
            super(client);
        }

        @Override
        public Response execute(Request request) throws IOException
        {
            Response response = super.execute(request);
            for (final Header header : response.getHeaders()) {
                if (null!= header.getName() && header.getName().equals("set-cookie")) {
                    editor = uidTelehealth.edit();
                    editor.putString("cookie", header.getValue());
                    editor.apply();
                }
                if (header.getName().equalsIgnoreCase("requireupdatetoken") && header.getValue().equalsIgnoreCase("true")){
                    dataRefresh = new JsonObject();
                    dataRefresh.addProperty("refreshCode", uidTelehealth.getString("refreshCode", null));
                    RESTClient.getRegisterApiLogin().getNewToken(dataRefresh, new Callback<JsonObject>() {
                        @Override
                        public void success(JsonObject jsonObject, Response response) {
                            editor = uidTelehealth.edit();
                            editor.putString("token", jsonObject.get("token").isJsonNull() ? " " : jsonObject.get("token").getAsString());
                            editor.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ? " " : jsonObject.get("refreshCode").getAsString());
                            editor.apply();
                        }

                        @Override
                        public void failure(RetrofitError error) {
                            Log.d(TAG , "ERROR" + error.getLocalizedMessage());
                        }
                    });
                }
            }
            return response;
        }
    }
}


