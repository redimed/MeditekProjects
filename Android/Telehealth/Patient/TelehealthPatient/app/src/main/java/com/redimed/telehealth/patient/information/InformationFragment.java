package com.redimed.telehealth.patient.information;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.drawable.GlideDrawable;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.information.presenter.IInfoPresenter;
import com.redimed.telehealth.patient.information.presenter.InfoPresenter;
import com.redimed.telehealth.patient.information.view.IInfoView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Fox on 1/14/2016.
 */
public class InformationFragment extends Fragment implements IInfoView {

    private Context context;
    private IInfoPresenter iInfoPresenter;
    private String TAG = "INFORMATION", uid;

    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.scrollViewInfo)
    ScrollView scrollViewInfo;

    /* Information Patient */
    @Bind(R.id.avatarPatient)
    ImageView avatarPatient;
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


    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.btnBack)
    Button btnBack;

    public InformationFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_information, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);
        initVariable();
        SwipeRefresh();
        return v;
    }

    private void initVariable() {
        iInfoPresenter = new InfoPresenter(this, context, getActivity());

        Bundle bundle = getArguments();
        if (bundle != null) {
            uid = bundle.getString("telehealthUID", "");
            iInfoPresenter.getInfoPatient(uid);
        }
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                iInfoPresenter.getInfoPatient(uid);
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

    //Show information Patient
    @Override
    public void displayInfo(Patient[] patients) {
        if (patients != null) {
            String firstName, lastName;
            for (Patient patient : patients) {
                firstName = patient.getFirstName() == null ? "NONE" : patient.getFirstName();
                lastName = patient.getLastName() == null ? "" : patient.getLastName();
                lblNamePatient.setText(firstName + " " + lastName);
                lblHomePhone.setText(patient.getHomePhoneNumber() == null ? "NONE" : patient.getHomePhoneNumber());
                lblEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                lblDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
                lblAddress.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
                lblSuburb.setText(patient.getSuburb() == null ? "NONE" : patient.getSuburb());
                lblPostCode.setText(patient.getPostCode() == null ? "NONE" : patient.getPostCode());
                lblCountry.setText(patient.getCountryName() == null ? "NONE" : patient.getCountryName());

                //Call presenter load avatar
                iInfoPresenter.loadAvatar(Config.apiURLDownload + patient.getFileUID());
            }
        }
        swipeInfo.setRefreshing(false);
    }

    //Load image avatar
    @Override
    public void onLoadAvatar(Bitmap bitmap) {
        if (bitmap != null) {
            avatarPatient.setImageBitmap(bitmap);
        }
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.profile_title));
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iInfoPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
        swipeInfo.setRefreshing(false);
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iInfoPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
