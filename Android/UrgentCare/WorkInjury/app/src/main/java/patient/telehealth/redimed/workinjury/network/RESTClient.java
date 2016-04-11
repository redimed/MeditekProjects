package patient.telehealth.redimed.workinjury.network;

import android.content.Context;

import com.squareup.okhttp.OkHttpClient;

import java.util.concurrent.TimeUnit;

import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.utils.Config;
import patient.telehealth.redimed.workinjury.utils.RetrofitErrorHandler;
import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.client.OkClient;

public class RESTClient {
    private static RestAdapter restAdapter;
    private static OkHttpClient okHttpClient;
    private static Context context;
    private static RestAdapter telehealthAdapter;

    public static void InitRESTClient(Context ctx) {
        context = ctx;
        setupRestClient();
    }

    private static void setupRestClient() {
        okHttpClient = new OkHttpClient();
        okHttpClient.setReadTimeout(30, TimeUnit.SECONDS);
        okHttpClient.setConnectTimeout(30, TimeUnit.SECONDS);

        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURL)
                .setClient(new OkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();
        
        telehealthAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint(Config.Telehealth)
                .setClient(new OkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();
        
    }

    private static class SessionRequestInterceptor implements RequestInterceptor {
        public void intercept(RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("Accept", "application/json");
            paramRequestFacade.addHeader("Content-Type", "application/json");
            paramRequestFacade.addHeader("Version", "1.0");

        }
    }

    public static UrgentRequest getRegisterApi() {
        return restAdapter.create(UrgentRequest.class);
    }

    public static UrgentRequest getTelehealthApi(){
        return telehealthAdapter.create(UrgentRequest.class);
    }

}


