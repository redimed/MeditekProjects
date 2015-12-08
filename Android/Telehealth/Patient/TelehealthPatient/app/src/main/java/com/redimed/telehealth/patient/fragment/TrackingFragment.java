package com.redimed.telehealth.patient.fragment;

import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
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

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements View.OnClickListener {

    private View v;
    private Gson gson;
    private Picasso picasso;
    private RegisterApi restClient;
    private String TAG = "TRACKING";
    private String appointmentUID, status, fromTime, time, date, location, treating_doctor;

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
    @Bind(R.id.subTrackingLayout)
    RelativeLayout subTrackingLayout;

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

        Picasso.with(v.getContext()).load(R.drawable.slider2).transform(new BlurTransformation(v.getContext(), 20)).into(new Target() {
            @Override
            public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                    subTrackingLayout.setBackgroundDrawable(new BitmapDrawable(v.getContext().getResources(), bitmap));
                    subTrackingLayout.invalidate();
                } else {
                    subTrackingLayout.setBackground(new BitmapDrawable(v.getContext().getResources(), bitmap));
                    subTrackingLayout.invalidate();
                }
            }

            @Override
            public void onBitmapFailed(Drawable errorDrawable) {
                Log.d(TAG, "Error " + errorDrawable);
            }

            @Override
            public void onPrepareLoad(Drawable placeHolderDrawable) {
                Log.d(TAG, "Prepare Load " + placeHolderDrawable);

            }
        });
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
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(imgCircleBlurAttended);
                break;
            case "Waiting for approval":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(imgCircleBlurWait);
                break;
            case "Pending":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(imgCircleBlurPending);
                break;
            case "Received":
                Picasso picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
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
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(imgCircleBlurTime);
                break;
            case "Finished":
                picasso = new Picasso.Builder(v.getContext()).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
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
