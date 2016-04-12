package patient.telehealth.redimed.workinjury.network;

import android.content.Context;
import android.content.SharedPreferences;

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

import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.utils.Config;
import patient.telehealth.redimed.workinjury.utils.RetrofitErrorHandler;
import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.client.Header;
import retrofit.client.OkClient;
import retrofit.client.Request;
import retrofit.client.Response;

public class RESTClient {
    private static RestAdapter restAdapter;
    private static OkHttpClient okHttpClient;
    private static Context context;
    private static RestAdapter telehealthAdapter;
    private static RestAdapter authAdapter;
    private static RestAdapter coreAdapter;
    private static SharedPreferences workInjury;



    public static void InitRESTClient(Context ctx) {
        context = ctx;
        workInjury = context.getSharedPreferences("WorkInjury", context.MODE_PRIVATE);
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

    }

    private static class SessionRequestInterceptor implements RequestInterceptor {
        public void intercept(RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("systemtype", "ARD");
            paramRequestFacade.addHeader("deviceid", "66666666666666666666666666");
            paramRequestFacade.addHeader("appid", "com.redimed.telehealth.workinjury");
            paramRequestFacade.addHeader("Authorization", "Bearer " + workInjury.getString("token", ""));
            paramRequestFacade.addHeader("Cookie", workInjury.getString("cookie", ""));

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

    public static class InterceptingOkClient extends OkClient {

        public InterceptingOkClient(OkHttpClient client) {
            super(client);
        }

        @Override
        public Response execute(Request request) throws IOException {
            Response response = super.execute(request);
            for (final Header header : response.getHeaders()) {

                if (null != header.getName() && header.getName().equals("set-cookie")) {
                    SharedPreferences.Editor editor = workInjury.edit();
                    editor.putString("cookie", header.getValue());
                    editor.apply();
                }
                if (header.getName().equalsIgnoreCase("requireupdatetoken") && header.getValue().equalsIgnoreCase("true")) {

//                    JsonObject dataRefresh = new JsonObject();
//                    dataRefresh.addProperty("refreshCode", uidTelehealth.getString("refreshCode", null));
//
//                    RESTClient.getRegisterApiLogin().getNewToken(dataRefresh, new Callback<JsonObject>() {
//                        @Override
//                        public void success(JsonObject jsonObject, Response response) {
//                            editor = uidTelehealth.edit();
//                            editor.putString("token", jsonObject.get("token").isJsonNull() ? " " : jsonObject.get("token").getAsString());
//                            editor.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ? " " : jsonObject.get("refreshCode").getAsString());
//                            editor.apply();
//                        }
//
//                        @Override
//                        public void failure(RetrofitError error) {
//                            Log.d(TAG, "ERROR" + error.getLocalizedMessage());
//                        }
//                    });
                }
            }
            return response;
        }
    }
}


