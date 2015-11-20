package com.redimed.telehealth.patient.network;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.RetrofitErrorHandler;
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
    private static String TAG = "RESTCLIENT";
    private static RestAdapter restAdapter, restAdapterCore;
    private static OkHttpClient okHttpClient;
    private static SharedPreferences spDevice, uidTelehealth;
    private static Context context;
    private static SharedPreferences.Editor editor;
    private static JsonObject dataRefresh;
    private static Gson gson;

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

        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURL)
                .setClient(new InterceptingOkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

        restAdapterCore = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.apiURLCore)
                .setClient(new InterceptingOkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptorCore())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();
    }

    private static class SessionRequestInterceptor implements RequestInterceptor {
        public void intercept(RequestInterceptor.RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("Accept", "application/json");
            paramRequestFacade.addHeader("Content-Type", "application/json");
            paramRequestFacade.addHeader("SystemType", "Android");
            paramRequestFacade.addHeader("DeviceID", spDevice.getString("deviceID", null));
            paramRequestFacade.addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", null));
            paramRequestFacade.addHeader("UserUID", uidTelehealth.getString("userUID", null));
            paramRequestFacade.addHeader("Cookie", uidTelehealth.getString("cookie", null));
            paramRequestFacade.addHeader("AppID", "com.redimed.telehealth.patient");
        }
    }

    private static class SessionRequestInterceptorCore implements RequestInterceptor {
        public void intercept(RequestInterceptor.RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("SystemType", "ARD");
            paramRequestFacade.addHeader("DeviceID", spDevice.getString("deviceID", null));
            paramRequestFacade.addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", null));
            paramRequestFacade.addHeader("Cookie", uidTelehealth.getString("cookie", null));
            paramRequestFacade.addHeader("UserUID", uidTelehealth.getString("userUID", null));
            paramRequestFacade.addHeader("AppID", "com.redimed.telehealth.patient");
        }
    }

    public static RegisterApi getRegisterApi() {
        return restAdapter.create(RegisterApi.class);
    }

    public static RegisterApi getRegisterApiCore() {
        return restAdapterCore.create(RegisterApi.class);
    }

    static class InterceptingOkClient extends OkClient
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
                    editor.commit();
                }
                if (header.getName().equalsIgnoreCase("requireupdatetoken") && header.getValue().equalsIgnoreCase("true")){
                    gson = new Gson();
                    dataRefresh = new JsonObject();
                    dataRefresh.addProperty("refreshCode", uidTelehealth.getString("refreshCode", null));
                    RESTClient.getRegisterApiCore().getNewToken(dataRefresh, new Callback<JsonObject>() {
                        @Override
                        public void success(JsonObject jsonObject, Response response) {
                            Log.d(TAG, jsonObject + " ");
                            editor = uidTelehealth.edit();
                            editor.putString("token", jsonObject.get("token").isJsonNull() ? " " : jsonObject.get("token").getAsString());
                            editor.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ? " " : jsonObject.get("refreshCode").getAsString());
                            editor.commit();
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


