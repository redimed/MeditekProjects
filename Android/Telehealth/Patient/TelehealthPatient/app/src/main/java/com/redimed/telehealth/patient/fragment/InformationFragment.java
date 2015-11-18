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
import android.widget.Button;
import android.widget.ScrollView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;

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

    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    @Bind(R.id.lblHomePhone)
    TextView lblHomePhone;
    @Bind(R.id.lblAddress)
    TextView lblAddress;
    @Bind(R.id.lblSuburb)
    TextView lblSuburb;
    @Bind(R.id.lblPostCode)
    TextView lblPostCode;
    @Bind(R.id.lblCountry)
    TextView lblCountry;
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
        v = inflater.inflate(R.layout.fragment_information, container, false);
        restClient = RESTClient.getRegisterApi();
        uid = getArguments().getString("telehealthUID");
        ButterKnife.bind(this, v);
        gson = new Gson();
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
        restClient.getDetailsPatient(uid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    Log.d(TAG, jsonObject.get("data").toString());
                    DisplayInfo(gson.fromJson(jsonObject.get("data").toString(), Patient[].class));
                    swipeInfo.setRefreshing(false);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else {
                    if (error.getLocalizedMessage().equalsIgnoreCase("TokenExpiredError")) {
                        new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Warning, "Sorry for inconvenience, please refresh application").show();
                    } else {
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
                lblNamePatient.setText(patient.getFirstName() == null ? "NONE" : patient.getFirstName());
                lblHomePhone.setText(patient.getHomePhoneNumber() == null ? "NONE" : patient.getHomePhoneNumber());
                lblEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                lblDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
                lblAddress.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
                lblSuburb.setText(patient.getSuburb() == null ? "NONE" : patient.getSuburb());
                lblPostCode.setText(patient.getPostCode() == null ? "NONE" : patient.getPostCode());
                lblCountry.setText(patient.getCountryName() == null ? "NONE" : patient.getCountryName());
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
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
