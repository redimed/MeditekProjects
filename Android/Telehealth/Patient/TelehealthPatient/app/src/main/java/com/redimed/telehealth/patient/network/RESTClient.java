package com.redimed.telehealth.patient.network;

import android.content.SharedPreferences;

import com.google.gson.annotations.Until;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.RetrofitErrorHandler;
import com.squareup.okhttp.OkHttpClient;

import java.util.concurrent.TimeUnit;

import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.client.OkClient;

/**
 * Created by luann on 9/23/2015.
 */
public class RESTClient {
    private static RestAdapter restAdapter, restAdapterUpload;
    private static OkHttpClient okHttpClient;
    private SharedPreferences uidTelehealth;

    static {
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
        private static final String TAG = SessionRequestInterceptor.class.getSimpleName();

        public void intercept(RequestInterceptor.RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("Content-Type", "application/json");
            paramRequestFacade.addHeader("Accept", "application/json");
        }
    }

    public static RegisterApi getRegisterApi(){
        return restAdapter.create(RegisterApi.class);
    }

    public static RegisterApi getRegisterApiUrl(){
        return restAdapterUpload.create(RegisterApi.class);
    }

}
