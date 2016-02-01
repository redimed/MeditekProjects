package com.redimed.telehealth.patient.tracking.presenter;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
    private FragmentActivity fragmentActivity;
    private List<Appointment> listAppointment;
    private SharedPreferences telehealthPatient;

    public TrackingPresenter(Context context, ITrackingView iTrackingView, FragmentActivity activity) {
        this.context = context;
        this.fragmentActivity = activity;
        this.iTrackingView = iTrackingView;

        gson = new Gson();
        iTrackingView.onLoadToolbar();
        registerApi = RESTClient.getRegisterApi();
        listAppointment = new ArrayList<Appointment>();
        iMainPresenter = new MainPresenter(context, fragmentActivity);
        telehealthPatient = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void getListAppointment() {
        listAppointment.clear();
        registerApi.getAppointmentPatients(telehealthPatient.getString("patientUID", ""), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("rows").toString();
                Appointment[] appointments = gson.fromJson(data, Appointment[].class);
                for (Appointment appointment : appointments) {
                    if (appointment.getFromTime() != null) {
                        listAppointment.add(appointment);
                    }
                }
                iTrackingView.onLoadListAppt(listAppointment);
            }

            @Override
            public void failure(RetrofitError error) {
                iTrackingView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null){
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void setProgressBarVisibility(int visibility) {
        iTrackingView.onSetProgressBarVisibility(visibility);
    }
}
