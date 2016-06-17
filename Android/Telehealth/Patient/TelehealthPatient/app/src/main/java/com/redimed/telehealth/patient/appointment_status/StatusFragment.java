package com.redimed.telehealth.patient.appointment_status;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.appointment.AppointmentFragment;
import com.redimed.telehealth.patient.appointment_status.presenter.IStatusPresenter;
import com.redimed.telehealth.patient.appointment_status.presenter.StatusPresenter;
import com.redimed.telehealth.patient.appointment_status.view.IStatusView;
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
    private IStatusPresenter iStatusPresenter;
    private final static String TAG = "=====STATUS=====";

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

    public StatusFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_status_appointment, container, false);
        setHasOptionsMenu(true);
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

    private void initVariable() {
        iStatusPresenter = new StatusPresenter(context, this, getActivity());
        iStatusPresenter.initToolbar(toolBar);

        Bundle bundle = getArguments();
        if (bundle != null) {
            displayStatus(bundle.getString("statusAppt", ""), bundle.getString("timeAppt", ""));
        }
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                Fragment fragment;
                if (getArguments() != null) {
                    fragment = new AppointmentFragment();
                    fragment.setArguments(getArguments());
                } else {
                    fragment = new TrackingFragment();
                }
                iStatusPresenter.changeFragment(fragment);
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void displayStatus(String statusAppt, String fromTime) {
        switch (statusAppt) {
            case "Attended":
                Picasso picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
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
                picasso = new Picasso.Builder(context).listener(new Picasso.Listener() {
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
                lblApp_Location.setText(getResources().getString(R.string.none));
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
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
            getView().setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                        Fragment fragment;
                        if (getArguments() != null) {
                            fragment = new AppointmentFragment();
                            fragment.setArguments(getArguments());
                        } else {
                            fragment = new TrackingFragment();
                        }
                        iStatusPresenter.changeFragment(fragment);
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
