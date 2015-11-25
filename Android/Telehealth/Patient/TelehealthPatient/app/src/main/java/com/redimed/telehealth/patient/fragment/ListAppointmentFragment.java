package com.redimed.telehealth.patient.fragment;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.ScrollView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.LauncherActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
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
import java.util.Timer;
import java.util.TimerTask;

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
    private List<Appointment> listAppointment;
    private LinearLayoutManager layoutManagerAppt;
    private RVAdapter rvAdapter;

    @Bind(R.id.rvListAppointment)
    RecyclerView rvListAppointment;
    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.lblNoData)
    TextView lblNoData;
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblHome)
    TextView btnHome;

    public ListAppointmentFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        v = inflater.inflate(R.layout.fragment_list_appointment, container, false);
        ButterKnife.bind(this, v);

        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();
        listAppointment = new ArrayList<Appointment>();

        GetListAppointmentPatient();

        rvListAppointment.setHasFixedSize(true);
        layoutManagerAppt = new LinearLayoutManager(v.getContext());
        rvListAppointment.setLayoutManager(layoutManagerAppt);
        rvAdapter = new RVAdapter(getActivity(), 1);
        rvListAppointment.setAdapter(rvAdapter);
        rvListAppointment.setOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                swipeInfo.setEnabled(layoutManagerAppt.findFirstCompletelyVisibleItemPosition() == 0);
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);

        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                GetListAppointmentPatient();
            }
        });

        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);
        toolBar.setBackgroundResource(R.drawable.appointment_list_bg);
        lblTitle.setText(getResources().getString(R.string.list_appt_title));
        btnHome.setText(getResources().getString(R.string.home_title));
        btnHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ((MainActivity) v.getContext()).Display(0);
            }
        });

        return v;
    }

    //    Get list Appointment to Patient
    private void GetListAppointmentPatient() {
        listAppointment.clear();
        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        registerApi.getAppointmentPatients(telehealthPatient.getString("patientUID", null), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                swipeInfo.setRefreshing(false);
                String data = jsonObject.get("rows").toString();
                Appointment[] appointments = gson.fromJson(data, Appointment[].class);
                for (Appointment appointment : appointments) {
                    if (appointment.getFromTime() != null) {
                        listAppointment.add(appointment);
                    }
                }
                rvAdapter.swapDataAppointment(listAppointment);
                if (listAppointment.size() == 0) {
                    lblNoData.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else {
                    new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                }
                swipeInfo.setRefreshing(false);
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
