package com.redimed.telehealth.patient.fragment;


import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.ClinicalDetail;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;

import java.util.Objects;

import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class TelehealthFragment extends Fragment {

    private String TAG = "TELEHEATH";
    private View v;
    private SharedPreferences telehealthPatient;
    private RegisterApi registerApi;
    private Gson gson;
    private String headerToken;
    private JsonObject patientJson, appointmentJson;
    private Patient patient;
    private Appointment appointment;

    public TelehealthFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        v = inflater.inflate(R.layout.fragment_telehealth, container, false);
        ButterKnife.bind(this, v);
        gson = new Gson();
        patient = new Patient();
        registerApi = RESTClient.getRegisterApi();
        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        headerToken = telehealthPatient.getString("token", null);
        patient.setUID(telehealthPatient.getString("patientUID", null));
        patient.setLimit("1");
        GetAppointmentPatient();
        return v;
    }

    private void GetAppointmentPatient() {
        patientJson = new JsonObject();
        patientJson.addProperty("data", gson.toJson(patient));
        registerApi.getAppointmentPatients(patientJson, headerToken, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("rows").toString();
                Appointment[] appointments = gson.fromJson(data, Appointment[].class);
                DisplayAppointmentPatient(appointments);
                Log.d(TAG, appointments.toString());
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    private void DisplayAppointmentPatient(Appointment[] appointments) {
        String appointmentUID = "N/A";
        for (int i = 0; i < appointments.length; i++){
            Log.d(TAG, appointments[i].getFromTime() == null ? "N/A" : appointments[i].getFromTime());
            Log.d(TAG, appointments[i].getToTime() == null ? "N/A" : appointments[i].getToTime());
            appointmentUID = appointments[i].getUID() == null ? appointmentUID : appointments[i].getUID();
        }
        GetAppointmentDetails(appointmentUID);
    }

    private void GetAppointmentDetails(String appointmentUID) {
        appointment = new Appointment();
        appointment.setUID(appointmentUID);
        appointmentJson = new JsonObject();
        appointmentJson.addProperty("data", gson.toJson(appointment));
        registerApi.getAppointmentDetails(appointmentJson, headerToken, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("data").toString();
                String clinicData = jsonObject.get("data").getAsJsonObject().get("TelehealthAppointment").getAsJsonObject().get("ClinicalDetails").toString();
                ClinicalDetail[] clinicalDetails = gson.fromJson(clinicData, ClinicalDetail[].class);
                Log.d(TAG, clinicData);
                DisplayAppointmentDetails(clinicalDetails);
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getMessage());
            }
        });
    }

    private void DisplayAppointmentDetails(ClinicalDetail[] details) {
        for (int i = 0; i < details.length; i++){
            Log.d(TAG, details[i].getName());
        }
    }


}
