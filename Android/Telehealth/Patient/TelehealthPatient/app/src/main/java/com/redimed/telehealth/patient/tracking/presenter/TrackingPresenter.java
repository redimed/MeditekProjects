package com.redimed.telehealth.patient.tracking.presenter;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.network.RetrofitErrorHandler;
import com.redimed.telehealth.patient.tracking.view.ITrackingView;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;

/**
 * Created by Fox on 1/18/2016.
 */
public class TrackingPresenter implements ITrackingPresenter {

    private Gson gson;
    private Context context;
    private ITrackingView iTrackingView;
    private IMainPresenter iMainPresenter;
    private List<Appointment> listAppointment;
    private SharedPreferences telehealthPatient;
    private static final String TAG = "==TRACKING_PRESENTER==";

    public TrackingPresenter(Context context, ITrackingView iTrackingView, FragmentActivity activity) {
        this.context = context;
        this.iTrackingView = iTrackingView;

        gson = new Gson();
        listAppointment = new ArrayList<Appointment>();
        iMainPresenter = new MainPresenter(context, activity);
        telehealthPatient = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public List<Appointment> getListAppointment(int offset) {
        String strData = "{" +
                "\"Order\": [{\"Appointment\": {\"CreatedDate\": \"DESC\"}}], " +
                "\"Filter\": [" +
                "{\"Appointment\": {\"Enable\": \"Y\"}}," +
                "{\"Patient\": {\"UID\": \"" + telehealthPatient.getString("patientUID", "") + "\"}}," +
                "{\"TelehealthAppointment\": {\"Type\": \"\"}}]," +
                "\"Limit\": 10, " + "\"Offset\": " + offset +
                "}";

        JsonObject jData = new JsonObject();
        jData.addProperty("data", gson.toJson(strData));
        try {
            JsonObject jBody = new LoadListAppointment(context, jData).execute().get();
            if (jBody != null) {
                if (jBody.get("ErrorsList") != null) {
                    String strResponse = jBody.get("ErrorsList").getAsString() == null ? "" : jBody.get("ErrorsList").getAsString();
                    if (strResponse.equalsIgnoreCase("isAuthenticated.notAuthenticated") || strResponse.equalsIgnoreCase("isAuthenticated.oldRefreshCodeExpired")) {
                        iTrackingView.onLoadError("TokenExpiredError");
                    } else if (strResponse.equalsIgnoreCase("isAuthenticated.sessionUserMismatchedUserAccess")) {
                        iTrackingView.onLoadError("Session Mismatched, please refresh again!");
                    } else {
                        iTrackingView.onLoadError(strResponse);
                    }
                }
                Log.d(TAG, jBody + "");
                listAppointment = gson.fromJson(jBody.get("rows").toString(), new TypeToken<List<Appointment>>() {}.getType());
            }
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage() + "");
        }
        return listAppointment;
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void setProgressBarVisibility(int visibility) {
        iTrackingView.onSetProgressBarVisibility(visibility);
    }
}

/*  Param 1: param doInBackground
    Param 2: param onProgressUpdate
    Param 3: param onPostExecute; return type doInBackground */
class LoadListAppointment extends AsyncTask<Void, Void, JsonObject> {

    private JsonObject jData;
    private static MediaType JSON;
    private static final String TAG = "===LIST_APPT===";

    public LoadListAppointment(Context context, JsonObject jData) {
        this.jData = jData;

        JSON = MediaType.parse("application/json; charset=utf-8");
    }

    @Override
    protected JsonObject doInBackground(Void... params) {
        try {
            RequestBody requestBody = RequestBody.create(JSON, jData.toString());

            OkHttpClient okHttpClient = new OkHttpClient();
            okHttpClient.interceptors().add(new RESTClient.RequestInterceptor());

            Request request = new Request.Builder()
                    .url(Config.apiURL + "/api/telehealth/user/appointments")
                    .post(requestBody)
                    .build();

            Response response = okHttpClient.newCall(request).execute();
            String strBody = response.body().string();

            return new JsonParser().parse(strBody).getAsJsonObject();
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage());
            return null;
        }
    }
}