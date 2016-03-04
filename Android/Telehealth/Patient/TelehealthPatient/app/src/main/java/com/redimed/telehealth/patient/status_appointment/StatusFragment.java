package com.redimed.telehealth.patient.status_appointment;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.status_appointment.presenter.IStatusPresenter;
import com.redimed.telehealth.patient.status_appointment.presenter.StatusPresenter;
import com.redimed.telehealth.patient.status_appointment.view.IStatusView;
import com.redimed.telehealth.patient.tracking.TrackingFragment;
import com.redimed.telehealth.patient.utlis.BlurTransformation;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class StatusFragment extends Fragment implements IStatusView {

    private Context context;
    private Picasso picasso;
    private IStatusPresenter iStatusPresenter;
    private String TAG = "STATUS";

    @Bind(R.id.layoutApptStatus)
    LinearLayout layoutApptStatus;

    /* Status View */
    @Bind(R.id.borderReceived)
    ImageView borderReceived;
    @Bind(R.id.borderPending)
    ImageView borderPending;
    @Bind(R.id.borderTime)
    ImageView borderTime;
    @Bind(R.id.borderAttended)
    ImageView borderAttended;
    @Bind(R.id.borderWait)
    ImageView borderWait;
    @Bind(R.id.borderFinish)
    ImageView borderFinish;

    /* Layout Appointment Time */
    @Bind(R.id.layoutApptTime)
    LinearLayout layoutApptTime;
    @Bind(R.id.lineApptTime)
    View lineAppTime;
    @Bind(R.id.lblApp_Time)
    TextView lblApp_Time;
    @Bind(R.id.lblApp_Date)
    TextView lblApp_Date;
    @Bind(R.id.lblApp_Location)
    TextView lblApp_Location;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;

    public StatusFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_status_appointment, container, false);
        this.context = v.getContext();
        ButterKnife.bind(this, v);
        initVariable();
        animationBG();
        return v;
    }

    private void animationBG() {
        int width = DeviceUtils.getScreenWidth(context);
        int height = DeviceUtils.getScreenHeight(context);
        Glide.with(this).load(R.drawable.slider2).asBitmap()
                .transform(new BlurTransformation(context, 15))
                .into(new SimpleTarget<Bitmap>(width, height) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                            layoutApptStatus.setBackgroundDrawable(new BitmapDrawable(context.getResources(), resource));
                            layoutApptStatus.invalidate();
                        } else {
                            layoutApptStatus.setBackground(new BitmapDrawable(context.getResources(), resource));
                            layoutApptStatus.invalidate();
                        }
                    }
                });
    }

    private void initVariable(){
        iStatusPresenter = new StatusPresenter(context, this, getActivity());
        Bundle bundle = getArguments();
        if (bundle != null) {
            displayStatus(bundle.getString("statusAppt", ""), bundle.getString("timeAppt", ""));
        }
    }

    private void displayStatus(String statusAppt, String fromTime) {
        switch (statusAppt){
            case "Attended":
                picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(borderAttended);
                break;
            case "Waiting for approval":
                picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(borderWait);
                break;
            case "Pending":
                picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(borderPending);
                break;
            case "Received":
                Picasso picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(borderReceived);
                break;
            case "Approved":
                lineAppTime.setVisibility(View.VISIBLE);
                layoutApptTime.setVisibility(View.VISIBLE);
                lblApp_Date.setText(MyApplication.getInstance().ConvertDate(fromTime));
                lblApp_Time.setText(MyApplication.getInstance().ConvertTime(fromTime));
                lblApp_Location.setText("None");
                picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(borderTime);
                break;
            case "Finished":
                picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d(TAG, exception.getLocalizedMessage());
                    }
                }).build();
                picasso.load(R.drawable.sub_tracking_bg)
                        .into(borderFinish);
                break;
        }
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.list_appt_title));
        lblSubTitle.setText(getResources().getString(R.string.list_appt_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iStatusPresenter.changeFragment(new TrackingFragment());
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
                    iStatusPresenter.changeFragment(new TrackingFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
