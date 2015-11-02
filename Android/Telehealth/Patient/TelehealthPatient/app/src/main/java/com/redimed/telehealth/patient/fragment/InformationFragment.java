package com.redimed.telehealth.patient.fragment;

import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class InformationFragment extends Fragment{

    private String TAG = "INFORMATION", uid;
    private View v;
    private RegisterApi restClient;
    private Gson gson;
    private Patient[] patients;
    private SharedPreferences sharedPreferences;

    @Bind(R.id.txtFirstName)
    EditText txtFirstName;
    @Bind(R.id.txtLastName)
    EditText txtLastName;
    @Bind(R.id.txtPhone)
    EditText txtPhone;
    @Bind(R.id.txtEmail)
    EditText txtEmail;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtAddress1)
    EditText txtAddress1;
    @Bind(R.id.txtAddress2)
    EditText txtAddress2;
    @Bind(R.id.btnSubmit)
    Button btnSubmit;
    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.scrollViewInfo)
    ScrollView scrollViewInfo;

    public InformationFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
        restClient = RESTClient.getRegisterApi();
        uid = getArguments().getString("telehealthUID");
        gson = new Gson();

        v = inflater.inflate(R.layout.fragment_information, container, false);
        ButterKnife.bind(this, v);

        sharedPreferences = v.getContext().getSharedPreferences("PatientInfo", v.getContext().MODE_PRIVATE);
        patients = gson.fromJson(sharedPreferences.getString("info", null), Patient[].class);
        if (patients != null){
            DisplayInfo(patients);
        } else {
            GetInfoPatient();
        }

        SwipeRefresh();

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ((MainActivity) v.getContext()).Display(0);
            }
        });
        return v;
    }

    //Call api to get data information patient from server
    private void GetInfoPatient() {
        TelehealthUser telehealthUser = new TelehealthUser();
        telehealthUser.setUID(uid);

        JsonObject patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));

        restClient.getDetailsPatient(patientJSON, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    DisplayInfo(gson.fromJson(jsonObject.get("data").toString(), Patient[].class));
                    swipeInfo.setRefreshing(false);
                }
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
                swipeInfo.setRefreshing(false);
            }
        });
    }

    //Show data information in layout
    private void DisplayInfo(Patient[] patients) {
        if (patients != null){
            for (Patient patient : patients) {
                txtFirstName.setText(patient.getFirstName() == null ? "NONE" : patient.getFirstName());
                txtLastName.setText(patient.getLastName() == null ? "NONE" : patient.getLastName());
                txtPhone.setText(patient.getUserAccount().getPhoneNumber() == null ? "NONE" : patient.getUserAccount().getPhoneNumber());
                txtEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                txtDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
                txtAddress1.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
                txtAddress2.setText(patient.getAddress2() == null ? "NONE" : patient.getAddress2());
            }
        }
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                GetInfoPatient();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);

        scrollViewInfo.post(new Runnable() {
            @Override
            public void run() {
                scrollViewInfo.fullScroll(ScrollView.FOCUS_UP);
                scrollViewInfo.scrollTo(0, 0);
            }
        });

        scrollViewInfo.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                int scrollY = scrollViewInfo.getScrollY();
                if (scrollY == 0) {
                    swipeInfo.setEnabled(true);
                } else swipeInfo.setEnabled(false);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
