package com.redimed.telehealth.patient.network;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.utlis.DefineKey;
import com.squareup.okhttp.Interceptor;
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
    private static SharedPreferences uidTelehealth;
    private static final String TAG = "=====REST_CLIENT=====";
    private static RestAdapter restAdapter, restAdapterCore, restAdapterLogin, restAdapterEForm;

    public static void InitRESTClient(Context ctx) {
        context = ctx;
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
            okHttpClient.setReadTimeout(60, TimeUnit.SECONDS);
            okHttpClient.setConnectTimeout(60, TimeUnit.SECONDS);
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

        //3015
        restAdapterEForm = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.apiURLEForm)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler(context))
                .build();
    }

    public static class SessionRequestInterceptor extends RequestInterceptor implements retrofit.RequestInterceptor {
        public void intercept(RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("AppID", DefineKey.AppID);
            paramRequestFacade.addHeader("SystemType", DefineKey.SystemType);
            paramRequestFacade.addHeader("Cookie", uidTelehealth.getString("cookie", ""));
            paramRequestFacade.addHeader("UserUID", uidTelehealth.getString("userUID", ""));
            paramRequestFacade.addHeader("DeviceID", uidTelehealth.getString("deviceID", ""));
            paramRequestFacade.addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", ""));
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

    public static RegisterApi getRegisterApiEForm() {
        return restAdapterEForm.create(RegisterApi.class);
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

                    Log.d(TAG, header.getValue());
                }
                if (null != header.getName() && header.getName().equalsIgnoreCase("requireupdatetoken") && header.getValue().equalsIgnoreCase("true")) {

                    JsonObject dataRefresh = new JsonObject();
                    dataRefresh.addProperty("refreshCode", uidTelehealth.getString("refreshCode", ""));

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

    // HEADER REQUEST for OkHttp
    public static class RequestInterceptor implements Interceptor {

        public RequestInterceptor() {}

        @Override
        public com.squareup.okhttp.Response intercept(Chain chain) throws IOException {
            com.squareup.okhttp.Request originalRequest = chain.request();

            com.squareup.okhttp.Request compressedRequest = originalRequest.newBuilder()
                    .header("SystemType", DefineKey.SystemType)
                    .header("DeviceID", uidTelehealth.getString("deviceID", ""))
                    .header("Authorization", "Bearer " + uidTelehealth.getString("token", ""))
                    .header("UserUID", uidTelehealth.getString("userUID", ""))
                    .header("Cookie", uidTelehealth.getString("cookie", ""))
                    .header("AppID", DefineKey.AppID)
                    .build();

            return chain.proceed(compressedRequest);
        }
    }
}


