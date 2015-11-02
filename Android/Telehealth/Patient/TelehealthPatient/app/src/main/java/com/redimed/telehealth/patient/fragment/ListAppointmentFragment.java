package com.redimed.telehealth.patient.fragment;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.redimed.telehealth.patient.utils.RVAdapter;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class ListAppointmentFragment extends Fragment {

    private String TAG = "LIST APPOINTMENT";
    private View v;
    private SharedPreferences telehealthPatient;
    private RegisterApi registerApi;
    private Gson gson;
    private JsonObject patientJson;
    private Patient patient;
    private Intent i;
    private List<Appointment> listAppointment;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapter rvAdapter;

    @Bind(R.id.rvListAppointment)
    RecyclerView rvListAppointment;
    @Bind(R.id.lblNoData)
    TextView lblNoData;

    public ListAppointmentFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        v = inflater.inflate(R.layout.fragment_list_appointment, container, false);
        ButterKnife.bind(this, v);

        gson = new Gson();
        patient = new Patient();
        registerApi = RESTClient.getRegisterApi();
        listAppointment = new ArrayList<Appointment>();

        GetListAppointmentPatient();

        rvListAppointment.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(v.getContext());
        rvListAppointment.setLayoutManager(layoutManagerCategories);
        rvAdapter = new RVAdapter(getActivity(), 1);
        rvListAppointment.setAdapter(rvAdapter);

        return v;
    }

    //    Get list Appointment to Patient
    private void GetListAppointmentPatient() {
        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        patient.setUID(telehealthPatient.getString("patientUID", null));
        patient.setLimit(null);

        patientJson = new JsonObject();
        patientJson.addProperty("data", gson.toJson(patient));
        registerApi.getAppointmentPatients(patientJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("rows").toString();
                Appointment[] appointments = gson.fromJson(data, Appointment[].class);
                for (Appointment appointment : appointments){
                    listAppointment.add(appointment);
                }
                rvAdapter.swapDataAppointment(listAppointment, getActivity());
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else {
                    if (error.getLocalizedMessage().equalsIgnoreCase("TokenExpiredError")){
                        new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Warning,  "Sorry for inconvenience, please refresh application").show();
                    }else {
                        new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                    }
                }
            }
        });
    }
}
