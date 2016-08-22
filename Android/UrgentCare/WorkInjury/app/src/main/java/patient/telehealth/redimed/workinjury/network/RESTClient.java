package patient.telehealth.redimed.workinjury.network;

import android.util.Log;
import com.google.gson.JsonObject;
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
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.utils.Config;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.RetrofitErrorHandler;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Header;
import retrofit.client.OkClient;
import retrofit.client.Request;
import retrofit.client.Response;

public class RESTClient {
    private static RestAdapter restAdapter;
    private static OkHttpClient okHttpClient;
    private static RestAdapter telehealthAdapter;
    private static RestAdapter authAdapter;
    private static RestAdapter restAdapterEForm;
    private static RestAdapter coreAdapter;
    private static MyApplication application;



    public static void InitRESTClient() {
        application = MyApplication.getInstance();
        setupRestClient();
    }

    private static void setupRestClient() {
        okHttpClient = new OkHttpClient();
        okHttpClient.setReadTimeout(30, TimeUnit.SECONDS);
        okHttpClient.setConnectTimeout(30, TimeUnit.SECONDS);

        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURL)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

        telehealthAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.Telehealth)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

        authAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.Auth)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

        coreAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.Core)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

        //3015
        restAdapterEForm = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.EForm)
                .setClient(new InterceptingOkClient(getUnsafeOkHttpClient()))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();

    }

    private static class SessionRequestInterceptor extends RequestInterceptor implements retrofit.RequestInterceptor{
        public void intercept(retrofit.RequestInterceptor.RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader(Key.systemtype, Key.ARD);
            paramRequestFacade.addHeader(Key.deviceid, android.os.Build.MANUFACTURER+android.os.Build.MODEL);
            paramRequestFacade.addHeader(Key.appid, Key.appidValue);
            paramRequestFacade.addHeader(Key.authorization, Key.bearer + String.valueOf(application.getDataSharedPreferences(Key.token, Key.defalt)));
            paramRequestFacade.addHeader(Key.cookie, String.valueOf(application.getDataSharedPreferences(Key.cookie, Key.defalt)));
            paramRequestFacade.addHeader(Key.useruid, String.valueOf(application.getDataSharedPreferences(Key.useruid, Key.defalt)));
        }
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
            final SSLContext sslContext = SSLContext.getInstance(Key.SSL);
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

    public static UrgentRequest getRegisterApi() {
        return restAdapter.create(UrgentRequest.class);
    }

    public static UrgentRequest getTelehealthApi() {
        return telehealthAdapter.create(UrgentRequest.class);
    }

    public static UrgentRequest getAuthApi() {
        return authAdapter.create(UrgentRequest.class);
    }

    public static UrgentRequest getCoreApi() {
        return coreAdapter.create(UrgentRequest.class);
    }
    public static UrgentRequest getEFormApi() {
        return restAdapterEForm.create(UrgentRequest.class);
    }

    public static class InterceptingOkClient extends OkClient {

        public InterceptingOkClient(OkHttpClient client) {
            super(client);
        }

        @Override
        public Response execute(Request request) throws IOException {
            Response response = super.execute(request);
            for (final Header header : response.getHeaders()) {

                if (null != header.getName() && header.getName().equals(Key.setCookie)) {
                    application.setDataSharedPreferences(Key.cookie, header.getValue());
                }
                if (header.getName().equalsIgnoreCase(Key.requireupdatetoken) && header.getValue().equalsIgnoreCase(Key.trueValue)) {
                    JsonObject dataRefresh = new JsonObject();
                    dataRefresh.addProperty(Key.refreshCode, String.valueOf(application.getDataSharedPreferences(Key.refreshCode, null)));
                    Log.d(Key.requireupdatetoken, dataRefresh + Key.defalt);
                    RESTClient.getAuthApi().getNewToken(dataRefresh, new Callback<JsonObject>() {
                        @Override
                        public void success(JsonObject jsonObject, Response response) {
                            application.setDataSharedPreferences(Key.token, jsonObject.get(Key.token).isJsonNull() ? Key.space : jsonObject.get(Key.token).getAsString());
                            application.setDataSharedPreferences(Key.refreshCode, jsonObject.get(Key.refreshCode).isJsonNull() ? Key.space : jsonObject.get(Key.refreshCode).getAsString());
                        }

                        @Override
                        public void failure(RetrofitError error) {
                            Log.d("=====REST_CLIENT=====", "ERROR" + error.getLocalizedMessage());
                        }
                    });
                }
            }
            return response;
        }
    }

    public static class RequestInterceptor implements Interceptor {

        public RequestInterceptor() {
        }

        @Override
        public com.squareup.okhttp.Response intercept(Chain chain) throws IOException {
            com.squareup.okhttp.Request originalRequest = chain.request();

            com.squareup.okhttp.Request compressedRequest = originalRequest.newBuilder()
                    .header(Key.systemtype, Key.ARD)
                    .header(Key.deviceid, android.os.Build.MANUFACTURER+android.os.Build.MODEL)
                    .header(Key.authorization, Key.bearer + String.valueOf(application.getDataSharedPreferences(Key.token, Key.defalt)))
                    .header(Key.useruid, String.valueOf(application.getDataSharedPreferences(Key.useruid, Key.defalt)))
                    .header(Key.cookie, String.valueOf(application.getDataSharedPreferences(Key.cookie, Key.defalt)))
                    .header(Key.appid, Key.appidValue)
                    .build();

            return chain.proceed(compressedRequest);
        }
    }

}


