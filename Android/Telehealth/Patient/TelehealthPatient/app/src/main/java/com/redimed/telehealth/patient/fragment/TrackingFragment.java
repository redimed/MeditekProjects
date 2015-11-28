package com.redimed.telehealth.patient.fragment;

import android.net.Uri;
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
import android.widget.TextView;

import com.google.gson.Gson;

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements View.OnClickListener {

    private String TAG = "TRACKING";
    private View v;
    private String appointmentUID, status, fromTime, time, date, location, treating_doctor;
    private RegisterApi restClient;
    private Gson gson;
    private Picasso picasso;

    @Bind(R.id.btnBack)
    TextView btnBack;
    @Bind(R.id.btnAppt)
    Button btnAppt;
    @Bind(R.id.imgCircleBlurReceived)
    ImageView imgCircleBlurReceived;
    @Bind(R.id.imgCircleBlurPending)
    ImageView imgCircleBlurPending;
    @Bind(R.id.imgCircleBlurTime)
    ImageView imgCircleBlurTime;
    @Bind(R.id.imgCircleBlurAttended)
    ImageView imgCircleBlurAttended;
    @Bind(R.id.imgCircleBlurWait)
    ImageView imgCircleBlurWait;
    @Bind(R.id.imgCircleBlurFinish)
    ImageView imgCircleBlurFinish;
    @Bind(R.id.lblApp_Time)
    TextView lblApp_Time;
    @Bind(R.id.lblApp_Date)
    TextView lblApp_Date;
    @Bind(R.id.lblApp_Location)
    TextView lblApp_Location;
    @Bind(R.id.lineApptTime)
    View lineAppTime;
    @Bind(R.id.layoutApptTime)
    LinearLayout layoutApptTime;

    public TrackingFragment() {}

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
        Log.d(TAG, status);
        return v;
    }

    private void DisplayTracking(String status) {
        switch (status) {
            case "Attended":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.circel_bg)
                        .transform(new BlurTransformation(v.getContext(), 20))
                        .into(imgCircleBlurAttended);
                break;
            case "Waiting for approval":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.circel_bg)
                        .transform(new BlurTransformation(v.getContext(), 20))
                        .into(imgCircleBlurWait);
                break;
            case "Pending":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.circel_bg)
                        .transform(new BlurTransformation(v.getContext(), 20))
                        .into(imgCircleBlurPending);
                break;
            case "Received":
                Picasso picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.circel_bg)
                        .transform(new BlurTransformation(v.getContext(), 20))
                        .into(imgCircleBlurReceived);
                break;
            case "Approved":
                layoutApptTime.setVisibility(View.VISIBLE);
                lineAppTime.setVisibility(View.VISIBLE);
                lblApp_Date.setText(MyApplication.getInstance().ConvertDate(fromTime));
                lblApp_Time.setText(MyApplication.getInstance().ConvertTime(fromTime));
                lblApp_Location.setText("None");
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.circel_bg)
                        .transform(new BlurTransformation(v.getContext(), 20))
                        .into(imgCircleBlurTime);
                break;
            case "Finished":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.circel_bg)
                        .transform(new BlurTransformation(v.getContext(), 20))
                        .into(imgCircleBlurFinish);
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
                ((MainActivity) v.getContext()).Display(0);
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
