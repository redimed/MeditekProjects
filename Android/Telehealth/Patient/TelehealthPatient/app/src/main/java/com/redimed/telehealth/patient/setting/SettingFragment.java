package com.redimed.telehealth.patient.setting;

import android.content.Context;
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
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.home.presenter.HomePresenter;
import com.redimed.telehealth.patient.home.presenter.IHomePresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.setting.presenter.ISettingPresenter;
import com.redimed.telehealth.patient.setting.presenter.SettingPresenter;
import com.redimed.telehealth.patient.setting.view.ISettingView;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class SettingFragment extends Fragment implements ISettingView, View.OnClickListener {

    private String uid;
    private Context context;
    private ISettingPresenter iSettingPresenter;
    private static final String TAG = "=====SETTING=====";

    @Bind(R.id.lblPhoneNumber)
    TextView lblPhoneNumber;
    @Bind(R.id.btnLogout)
    TextView btnLogout;
    @Bind(R.id.lblName)
    TextView lblName;
    @Bind(R.id.layoutAbout)
    RelativeLayout layoutAbout;
    @Bind(R.id.layoutProfile)
    LinearLayout layoutProfile;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;

    public SettingFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_setting, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        initVariable();
        onLoadToolbar();

        btnLogout.setOnClickListener(this);
        layoutAbout.setOnClickListener(this);
        layoutProfile.setOnClickListener(this);

        return v;
    }

    private void initVariable() {
        iSettingPresenter = new SettingPresenter(this, context, getActivity());

        Bundle bundle = getArguments();
        if (bundle != null) {
            uid = bundle.getString("telehealthUID", "");
            iSettingPresenter.getInfoPatient(bundle.getString("dataPatient", ""));
        }
    }

    @Override
    public void displayShortInfo(Patient[] patients) {
        String firstName, lastName;
        if (patients != null) {
            for (Patient patient : patients) {
                firstName = patient.getFirstName() == null ? "NONE" : patient.getFirstName();
                lastName = patient.getLastName() == null ? "" : patient.getLastName();
                lblPhoneNumber.setText(patient.getPhoneNumber() == null ? "NONE" : patient.getPhoneNumber());
                lblName.setText(firstName + " " + lastName);
            }
        }
    }

    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.setting_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iSettingPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnLogout:
                iSettingPresenter.logout(uid);
                break;
            case R.id.layoutProfile:
                iSettingPresenter.displayInfoPatient(uid);
                break;
            case R.id.layoutAbout:
                iSettingPresenter.displayAbout();
                break;
        }
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        getView().requestFocus();
        getView().setFocusableInTouchMode(true);
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iSettingPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
