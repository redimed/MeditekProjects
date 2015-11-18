package com.redimed.telehealth.patient.fragment;

import android.content.res.Resources;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CircleTransform;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements View.OnClickListener {

    private String TAG = "TRACKING";
    private View v;
    private String appointmentUID, status, fromTime, time, date, location, treating_doctor;
    private RegisterApi restClient;
    private Gson gson;

    @Bind(R.id.btnBack)
    Button btnBack;
    @Bind(R.id.btnAppt)
    Button btnAppt;
    @Bind(R.id.lblReceived)
    ImageView lblReceived;
    @Bind(R.id.lblPending)
    ImageView lblPending;
    @Bind(R.id.lblTime)
    ImageView lblTime;
    @Bind(R.id.lblAttended)
    ImageView lblAttended;
    @Bind(R.id.lblWait)
    ImageView lblWait;
    @Bind(R.id.lblFinish)
    ImageView lblFinish;

    public TrackingFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        v = inflater.inflate(R.layout.fragment_tracking, container, false);
        ButterKnife.bind(this, v);

        appointmentUID = this.getArguments().getString("apptUID", null);
        status = this.getArguments().getString("status", null);
        fromTime = this.getArguments().getString("fromTime", null);

        restClient = RESTClient.getRegisterApi();
        gson = new Gson();

        btnBack.setOnClickListener(this);
        btnAppt.setOnClickListener(this);

        DisplayTracking(status);
//        GetStatusAppointment(appointmentUID);
        return v;
    }

    private void GetStatusAppointment(String appointmentUID) {
        restClient.getAppointmentDetails(appointmentUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                if (jsonObject.get("data").getAsJsonObject() != null) {
                    Log.d(TAG, jsonObject.get("data").getAsJsonObject().get("Status").getAsString());
                    time = MyApplication.getInstance().ConvertTime(jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString());
                    date = MyApplication.getInstance().ConvertDate(jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString());
                    DisplayTracking(jsonObject.get("data").getAsJsonObject().get("Status").getAsString());
                }
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    private void DisplayTracking(String status) {
        switch (status) {
            case "Attended":
                Picasso.with(v.getContext())
                        .load(R.drawable.sub_tracking_attended_change)
                        .transform(new CircleTransform())
                        .resize(300, 300)
                        .into(lblAttended);
                break;
            case "Waitlist":
                Picasso.with(v.getContext())
                        .load(R.drawable.sub_tracking_wait_change)
                        .transform(new CircleTransform())
                        .resize(300, 300)
                        .into(lblWait);
                break;
            case "Pending":
                Picasso.with(v.getContext())
                        .load(R.drawable.sub_tracking_appt_pending_change)
                        .transform(new CircleTransform())
                        .resize(300, 300)
                        .into(lblPending);
                break;
            case "Received":
            Picasso.with(v.getContext())
                    .load(R.drawable.sub_tracking_received_change)
                    .into(lblReceived);
            break;
            case "Approved":
                Picasso.with(v.getContext())
                        .load(R.drawable.sub_tracking_appt_time_change)
                        .transform(new CircleTransform())
                        .resize(300, 300)
                        .into(lblTime);
                break;
            case "Finished":
                Picasso.with(v.getContext())
                        .load(R.drawable.sub_tracking_finish_change)
                        .transform(new CircleTransform())
                        .resize(300, 300)
                        .into(lblFinish);
                break;
        }
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
                    ((MainActivity) v.getContext()).Display(2);
                    return true;
                }
                return false;
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnBack:
                ((MainActivity) v.getContext()).Display(2);
                break;
            case R.id.btnAppt:
                Fragment fragment = new AppointmentDetails();
                Bundle bundle = new Bundle();
                bundle.putString("appointmentUID", appointmentUID);
                fragment.setArguments(bundle);
                ((MainActivity) v.getContext()).PerformNoBackStackTransaction(fragment);
                break;
        }
    }
}
