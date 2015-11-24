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

import com.google.gson.Gson;

import com.redimed.telehealth.patient.MainActivity;
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
    Button btnBack;
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
        return v;
    }

//    private void GetStatusAppointment(String appointmentUID) {
//        restClient.getAppointmentDetails(appointmentUID, new Callback<JsonObject>() {
//            @Override
//            public void success(JsonObject jsonObject, Response response) {
//                if (jsonObject.get("data").getAsJsonObject() != null) {
//                    Log.d(TAG, jsonObject.get("data").getAsJsonObject().get("Status").getAsString());
//                    time = MyApplication.getInstance().ConvertTime(jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString());
//                    date = MyApplication.getInstance().ConvertDate(jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString());
//                    DisplayTracking(jsonObject.get("data").getAsJsonObject().get("Status").getAsString());
//                }
//            }
//
//            @Override
//            public void failure(RetrofitError error) {
//
//            }
//        });
//    }

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
            case "Waitlist":
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
