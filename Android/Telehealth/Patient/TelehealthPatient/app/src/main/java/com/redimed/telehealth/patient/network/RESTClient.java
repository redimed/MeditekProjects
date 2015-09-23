package com.redimed.telehealth.patient.network;

import com.redimed.telehealth.patient.utils.Config;
import com.squareup.okhttp.OkHttpClient;

import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.client.OkClient;

/**
 * Created by luann on 9/23/2015.
 */
public class RESTClient {
    private static RestAdapter restAdapter;

    static {
        setupRestClient();
    }

    private static void setupRestClient() {
        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURL)
                .setClient(new OkClient(new OkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .build();
    }

    private static class SessionRequestInterceptor
            implements RequestInterceptor {
        private static final String TAG = SessionRequestInterceptor.class.getSimpleName();

        public void intercept(RequestInterceptor.RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("Content-Type", "application/json");
            paramRequestFacade.addHeader("Accept", "application/json");
        }
    }

}
