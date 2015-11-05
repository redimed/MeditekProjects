package com.redimed.telehealth.patient.network;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.RetrofitErrorHandler;
import com.squareup.okhttp.OkHttpClient;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import retrofit.Callback;
import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Header;
import retrofit.client.OkClient;
import retrofit.client.Request;
import retrofit.client.Response;

import static android.content.SharedPreferences.*;

/**
 * Created by luann on 9/23/2015.
 */
public class RESTClient {
    private static RestAdapter restAdapter, restAdapterUpload;
    private static OkHttpClient okHttpClient;
    private static SharedPreferences spDevice, uidTelehealth;
    private static Context context;

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

        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.apiURL)
                .setClient(new OkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

        restAdapterUpload = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURLUpload)
                .setClient(new OkClient(okHttpClient))
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
            paramRequestFacade.addHeader("UserUID", uidTelehealth.getString("accountUID", null));
        }
    }

    public static RegisterApi getRegisterApi() {
        return restAdapter.create(RegisterApi.class);
    }

    public static RegisterApi getRegisterApiUrl() {
        return restAdapterUpload.create(RegisterApi.class);
    }
}


