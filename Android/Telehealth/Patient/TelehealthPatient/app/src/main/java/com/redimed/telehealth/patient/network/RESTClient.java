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
import java.security.cert.CertificateException;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

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
    private static SharedPreferences.Editor editor;
    private static SharedPreferences spDevice, uidTelehealth;
    private static final String TAG = "=====REST_CLIENT=====";
    private static RestAdapter restAdapter, restAdapterCore, restAdapterLogin;


    public static void InitRESTClient(Context ctx) {
        context = ctx;
        spDevice = context.getSharedPreferences("DeviceInfo", Context.MODE_PRIVATE);
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);

        setupRestClient();
    }

    public static OkHttpClient getUnsafeOkHttpClient() {
        try {
            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType)
                                throws CertificateException {
                        }

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType)
                                throws CertificateException {
                        }

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return null;
                        }
                    }
            };

            // Install the all-trusting trust manager
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            //Cookie
            CookieManager cookieManager = new CookieManager();
            cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);

            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
            OkHttpClient okHttpClient = new OkHttpClient();
            okHttpClient.setSslSocketFactory(sslSocketFactory);
            okHttpClient.setReadTimeout(30, TimeUnit.SECONDS);
            okHttpClient.setConnectTimeout(30, TimeUnit.SECONDS);
            okHttpClient.setHostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });
            okHttpClient.setCookieHandler(cookieManager);
            return okHttpClient;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static void setupRestClient() {
        //3009
        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.apiURL)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();

        //3005
        restAdapterCore = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.apiURLCore)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();

        //3006
        restAdapterLogin = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURLLogin)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();
    }

    public static class SessionRequestInterceptor implements RequestInterceptor {
        public void intercept(RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("SystemType", "ARD");
            paramRequestFacade.addHeader("DeviceID", spDevice.getString("deviceID", ""));
            paramRequestFacade.addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", ""));
            paramRequestFacade.addHeader("UserUID", uidTelehealth.getString("userUID", ""));
            paramRequestFacade.addHeader("Cookie", uidTelehealth.getString("cookie", ""));
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

    public static class InterceptingOkClient extends OkClient {

        public InterceptingOkClient(OkHttpClient client) {
            super(client);
        }

        @Override
        public Response execute(Request request) throws IOException {
            Response response = super.execute(request);
            for (final Header header : response.getHeaders()) {

                if (null != header.getName() && header.getName().equals("set-cookie")) {
                    editor = uidTelehealth.edit();
                    editor.putString("cookie", header.getValue());
                    editor.apply();
                }
                if (header.getName().equalsIgnoreCase("requireupdatetoken") && header.getValue().equalsIgnoreCase("true")) {

                    JsonObject dataRefresh = new JsonObject();
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
                            Log.d(TAG, "ERROR" + error.getLocalizedMessage());
                        }
                    });
                }
            }
            return response;
        }
    }
}


