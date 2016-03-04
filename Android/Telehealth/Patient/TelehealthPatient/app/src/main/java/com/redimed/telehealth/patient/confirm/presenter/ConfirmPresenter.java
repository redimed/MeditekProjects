package com.redimed.telehealth.patient.confirm.presenter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.confirm.view.IConfirmView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.network.RESTClient;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 3/2/2016.
 */
public class ConfirmPresenter implements IConfirmPresenter {

    private Gson gson;
    private Context context;
    private RegisterApi registerApi;
    private IConfirmView iConfirmView;
    private IMainPresenter iMainPresenter;
    private String TAG = "CONFIRM_PRESENTER";

    public ConfirmPresenter(Context context, IConfirmView iConfirmView, FragmentActivity activity) {
        this.context = context;
        this.iConfirmView = iConfirmView;

        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public String getCurrentDateSystem() {
        SimpleDateFormat dateFormat= new SimpleDateFormat("EEE, dd MMM yyyy - HH:mm", Locale.ENGLISH);
        return dateFormat.format(new Date());
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void completeRequest(Intent i, ArrayList<String> fileUploads, String currentDate) {

        PatientAppointment patientAppointment = new PatientAppointment();
        patientAppointment.setFirstName(i.getStringExtra("firstName"));
        patientAppointment.setLastName(i.getStringExtra("lastName"));
        patientAppointment.setPhoneNumber(i.getStringExtra("mobile"));
        patientAppointment.setHomePhoneNumber(i.getStringExtra("mobile"));
        patientAppointment.setDOB(i.getStringExtra("dob"));
        patientAppointment.setSuburd(i.getStringExtra("suburb"));
        patientAppointment.setEmail(i.getStringExtra("email"));

        makeRequest(patientAppointment, i.getStringExtra("des"), i.getStringExtra("apptType"), fileUploads, currentDate);
    }

    private void makeRequest(PatientAppointment patientAppointment, String des, String apptType, ArrayList<String> fileUploads, String currentDate) {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("RequestDate", currentDate);
        jsonObject.addProperty("Description", des);
        jsonObject.addProperty("Type", apptType);
        jsonObject.addProperty("PatientAppointment", gson.toJson(patientAppointment));
        jsonObject.addProperty("FileUploads", gson.toJson(fileUploads));

        JsonObject dataRequest = new JsonObject();
        dataRequest.addProperty("data", gson.toJson(jsonObject));

        registerApi.requestTelehealth(dataRequest, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG, jsonObject + "");
            }

            @Override
            public void failure(RetrofitError error) {
                iConfirmView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

}
