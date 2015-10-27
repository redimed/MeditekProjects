package com.redimed.telehealth.patient.fragment;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.http.Part;

/**
 * A simple {@link Fragment} subclass.
 */
public class TelehealthFragment extends Fragment {

    private String TAG = "TELEHEALTH";
    private View v;
    private SharedPreferences telehealthPatient;
    private RegisterApi registerApi;
    private Gson gson;
    private String authToken, coreToken, fromTime, toTime, status, firstDoctor, middleDoctor, lastDoctor, emailDoctor, workPhoneDoctor, appointmentUID;
    private JsonObject patientJson, appointmentJson;
    private Patient patient;
    private Appointment appointment;
    private Intent i;
    private List<String> urlPicasso;

    @Bind(R.id.lblFromTime)
    TextView lblFromTime;
    @Bind(R.id.lblToTime)
    TextView lblToTime;
    @Bind(R.id.lblStatus)
    TextView lblStatus;
    @Bind(R.id.lblDoctorName)
    TextView lblDoctorName;
    @Bind(R.id.lblDoctorEmail)
    TextView lblDoctorEmail;
    @Bind(R.id.lblDoctorWorkPhone)
    TextView lblDoctorWorkPhone;
    @Bind(R.id.btnViewImage)
    Button btnViewImage;

    public TelehealthFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        v = inflater.inflate(R.layout.fragment_telehealth, container, false);
        ButterKnife.bind(this, v);

        urlPicasso = new ArrayList<String>();
        gson = new Gson();
        patient = new Patient();
        registerApi = RESTClient.getRegisterApi();

        GetAppointmentPatient();

        btnViewImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Fragment fragment = new ImageAppointmentFragment();
                Bundle bundle = new Bundle();
                bundle.putString("accountUID", telehealthPatient.getString("accountUID", null));
                bundle.putString("appointmentUID", appointmentUID);
                bundle.putStringArrayList("urlPicasso", (ArrayList<String>) urlPicasso);
                fragment.setArguments(bundle);

                FragmentManager fragmentManager = getActivity().getSupportFragmentManager();
                fragmentManager.beginTransaction().replace(R.id.frame_container, fragment).commit();
            }
        });

        return v;
    }

    //    Get single or list Appointment to Patient
    private void GetAppointmentPatient() {

        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        authToken = "Bearer " + telehealthPatient.getString("token", null);
        coreToken = "Bearer " +telehealthPatient.getString("coreToken", null);
        patient.setUID(telehealthPatient.getString("patientUID", null));
        patient.setLimit("1");

        patientJson = new JsonObject();
        patientJson.addProperty("data", gson.toJson(patient));
        registerApi.getAppointmentPatients(authToken, coreToken, patientJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {

                String data = jsonObject.get("rows").toString();
                Appointment[] appointments = gson.fromJson(data, Appointment[].class);

                if (appointments.length > 0) {
                    for (int i = 0; i < appointments.length; i++) {
                        appointmentUID = appointments[i].getUID() == null ? "N/A" : appointments[i].getUID();
                    }
                    GetAppointmentDetails(appointmentUID);
                } else {
                    Log.d(TAG, "No appointment");
                }
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else {
                    new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                }
            }
        });
    }

    //    Get Detail Appointment with param UID Appointment
    private void GetAppointmentDetails(String appointmentUID) {
        appointment = new Appointment();
        appointment.setUID(appointmentUID);
        appointmentJson = new JsonObject();
        appointmentJson.addProperty("data", gson.toJson(appointment));
        registerApi.getAppointmentDetails(authToken, coreToken, appointmentJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                if (jsonObject.get("data").getAsJsonObject() != null){
                    String doctor = jsonObject.get("data").getAsJsonObject().get("Doctors").toString();
                    Doctor[] doctors = gson.fromJson(doctor, Doctor[].class);

                    fromTime = jsonObject.get("data").getAsJsonObject().get("FromTime").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString();
                    toTime = jsonObject.get("data").getAsJsonObject().get("ToTime").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("ToTime").getAsString();
                    status = jsonObject.get("data").getAsJsonObject().get("Status").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("Status").getAsString();

                    if (doctors.length > 0) {
                        for (int i = 0; i < doctors.length; i++) {
                            firstDoctor = doctors[i].getFirstName() == null ? " " : doctors[i].getFirstName();
                            middleDoctor = doctors[i].getMiddleName() == null ? " " : doctors[i].getMiddleName();
                            lastDoctor = doctors[i].getLastName() == null ? " " : doctors[i].getLastName();
                            emailDoctor = doctors[i].getEmail();
                            workPhoneDoctor = doctors[i].getWorkPhoneNumber() == null ? "NONE" : doctors[i].getWorkPhoneNumber();
                        }
                    } else {
                        firstDoctor = " ";
                        middleDoctor = " ";
                        lastDoctor = " ";
                        emailDoctor = " ";
                        workPhoneDoctor = " ";
                    }

                    if (fromTime.equalsIgnoreCase("NONE") || toTime.equalsIgnoreCase("NONE")){
//                        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
//                        alertDialog.setTitle(R.string.title_dialog_appt);
//                        alertDialog.setMessage(v.getContext().getResources().getString(R.string.message_dialog_appt));
//
//                        alertDialog.setButton(DialogInterface.BUTTON_POSITIVE, "Close", new DialogInterface.OnClickListener() {
//                            @Override
//                            public void onClick(DialogInterface dialog, int which) {
//                                ((MainActivity) v.getContext()).Display(0);
//                            }
//                        });
//                        alertDialog.show();
                    }else {
                        lblFromTime.setText(ConvertDateTime(fromTime));
                        lblToTime.setText(ConvertDateTime(toTime));

                        if (status.equalsIgnoreCase("Approved")) {
                            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.approved));
                        } else {
                            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.unapproved));
                        }
                        lblStatus.setText(status);
                        lblDoctorName.setText(firstDoctor + middleDoctor + lastDoctor);
                        lblDoctorEmail.setText(emailDoctor);
                        lblDoctorWorkPhone.setText(workPhoneDoctor);
                    }

                    String fileUpload = jsonObject.get("data").getAsJsonObject().get("FileUploads").toString();
                    FileUpload[] fileUploads = gson.fromJson(fileUpload, FileUpload[].class);
                    GetFileUpload(fileUploads);
                } else {
                    Log.d(TAG, "No Result");
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    private void GetFileUpload(FileUpload[] fileUploads) {

        for (int i = 0; i < fileUploads.length; i++){
            urlPicasso.add(Config.apiURLDownload + fileUploads[i].getUID());
            Log.d(TAG, urlPicasso.get(i));
        }
        btnViewImage.setVisibility(View.VISIBLE);
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }

    @NonNull
    private String ConvertDateTime(String dataTime) {
        Log.d(TAG, dataTime);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Date myDate = null;
        try {
            myDate = dateFormat.parse(dataTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat timeFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String finalDate = timeFormat.format(myDate);

        return finalDate;
    }
}
