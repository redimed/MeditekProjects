package com.redimed.telehealth.patient.tracking.presenter;

import android.content.Context;
import android.content.SharedPreferences;
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
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.tracking.view.ITrackingView;

import java.util.ArrayList;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/18/2016.
 */
public class TrackingPresenter implements ITrackingPresenter {

    private Gson gson;
    private Context context;
    private RegisterApi registerApi;
    private ITrackingView iTrackingView;
    private IMainPresenter iMainPresenter;
    private List<Appointment> listAppointment;
    private SharedPreferences telehealthPatient;
    private String TAG = "=====TRACKING_PRESENTER=====";

    public TrackingPresenter(Context context, ITrackingView iTrackingView, FragmentActivity activity) {
        this.context = context;
        this.iTrackingView = iTrackingView;

        gson = new Gson();
        iTrackingView.onLoadToolbar();
        registerApi = RESTClient.getRegisterApi();
        listAppointment = new ArrayList<Appointment>();
        iMainPresenter = new MainPresenter(context, activity);
        telehealthPatient = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void getListAppointment(final int offset) {
        if (offset == 0)
            listAppointment.clear();

        String strData = "{" +
                "\"Order\": [{\"Appointment\": {\"CreatedDate\": \"DESC\"}}], " +
                "\"Filter\": [" +
                "{\"Appointment\": {\"Enable\": \"Y\"}}," +
                "{\"Patient\": {\"UID\": \"" + telehealthPatient.getString("patientUID", "") + "\"}}," +
                "{\"TelehealthAppointment\": {\"Type\": \"\"}}]," +
                "\"Limit\": null, " + "\"Offset\": " + offset +
                "}";

        JsonObject jData = new JsonObject();
        jData.addProperty("data", gson.toJson(strData));

       registerApi.getTrackingReferrals(jData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("rows").toString();
                listAppointment = gson.fromJson(data, new TypeToken<List<Appointment>>() {}.getType());
                if (offset <= 10)
                    iTrackingView.onLoadDataTracking(listAppointment);
            }

            @Override
            public void failure(RetrofitError error) {
                iTrackingView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void getListMoreAppointment(int offset){

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
