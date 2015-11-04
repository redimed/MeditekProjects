package com.redimed.urgentcare.utils;

import com.squareup.okhttp.OkHttpClient;

import retrofit.RestAdapter;
import retrofit.client.OkClient;

/**
 * Created by phanq on 09/18/2015.
 */
public class RetrofitClient {
    // No need to instantiate this class.
    private RetrofitClient() {
    }

    public static <S> S createService(Class<S> serviceClass) {
        RestAdapter.Builder builder = new RestAdapter.Builder()
                .setEndpoint(Config.API_ULR)
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setClient(new OkClient(new OkHttpClient()));
        RestAdapter adapter = builder.build();
        return adapter.create(serviceClass);
    }
}
