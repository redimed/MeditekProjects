package com.redimed.telehealth.patient.confirm.presenter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.widget.CheckBox;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.confirm.view.IConfirmView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.AppointmentData;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.network.RESTClient;

import java.text.ParseException;
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
    private String TAG = "=====CONFIRM_PRESENTER=====";

    public ConfirmPresenter(Context context, IConfirmView iConfirmView, FragmentActivity activity) {
        this.context = context;
        this.iConfirmView = iConfirmView;

        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public String getCurrentDateSystem() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, dd MMM yyyy 'at' HH:mm a", Locale.ENGLISH);
        return dateFormat.format(new Date());
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

    @Override
    public boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3) {
        return checkBox1.isChecked() && checkBox2.isChecked() && checkBox3.isChecked();
    }

    private void makeRequest(PatientAppointment patientAppointment, String des, String apptType, ArrayList<String> fileUploads, String currentDate) {

        JsonObject jConsent1 = new JsonObject();
        jConsent1.addProperty("Section", "Telehealth");
        jConsent1.addProperty("Category", "Appointment");
        jConsent1.addProperty("Type", "RequestPatient");
        jConsent1.addProperty("Name", "PatientConsent1");
        jConsent1.addProperty("Value", "Y");

        JsonObject jConsent2 = new JsonObject();
        jConsent2.addProperty("Section", "Telehealth");
        jConsent2.addProperty("Category", "Appointment");
        jConsent2.addProperty("Type", "RequestPatient");
        jConsent2.addProperty("Name", "PatientConsent2");
        jConsent2.addProperty("Value", "Y");

        JsonObject jConsent3 = new JsonObject();
        jConsent3.addProperty("Section", "Telehealth");
        jConsent3.addProperty("Category", "Appointment");
        jConsent3.addProperty("Type", "RequestPatient");
        jConsent3.addProperty("Name", "PatientConsent3");
        jConsent3.addProperty("Value", "Y");

        ArrayList<AppointmentData> appointmentDataArrayList = new ArrayList<AppointmentData>();
        appointmentDataArrayList.add(gson.fromJson(jConsent1, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent2, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent3, AppointmentData.class));

        JsonObject jRequest = new JsonObject();
        jRequest.addProperty("RequestDate", parseCurrentDate(currentDate));
        jRequest.addProperty("Description", des);
        jRequest.addProperty("Type", apptType);
        jRequest.addProperty("PatientAppointment", gson.toJson(patientAppointment));
        jRequest.addProperty("AppointmentData", gson.toJson(appointmentDataArrayList));
        jRequest.addProperty("FileUploads", gson.toJson(fileUploads));

        JsonObject dataRequest = new JsonObject();
        dataRequest.addProperty("data", gson.toJson(jRequest));

        registerApi.requestTelehealth(dataRequest, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iConfirmView.onLoadSuccess();
            }

            @Override
            public void failure(RetrofitError error) {
                iConfirmView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    private String parseCurrentDate(String currentDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("EEE, dd MMM yyyy 'at' HH:mm a", Locale.ENGLISH);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z", Locale.ENGLISH);
        try {
            Date date = inputFormat.parse(currentDate);
            currentDate = simpleDateFormat.format(date);
        } catch (ParseException e) {
            Log.d(TAG, e.getLocalizedMessage());
        }
        return currentDate;
    }

}
