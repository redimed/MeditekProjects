package com.redimed.telehealth.patient.setting;

import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.redisite.injury.InjuryFragment;
import com.redimed.telehealth.patient.redisite.patient.RedisiteFragment;
import com.redimed.telehealth.patient.setting.presenter.ISettingPresenter;
import com.redimed.telehealth.patient.setting.presenter.SettingPresenter;
import com.redimed.telehealth.patient.setting.view.ISettingView;
import com.redimed.telehealth.patient.widget.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class SettingFragment extends Fragment implements ISettingView, View.OnClickListener {

    private String uid;
    private Context context;
    private SweetAlertDialog progressDialog;
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
    @Bind(R.id.layoutChangePin)
    RelativeLayout layoutChangePin;

    // TODO: 6/7/16 REDISITE BUTTON
    @Bind(R.id.layoutRedisite)
    RelativeLayout layoutRedisite;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;

    public SettingFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_setting, container, false);
        setHasOptionsMenu(true);
        context = v.getContext();
        ButterKnife.bind(this, v);

        initVariable();

        btnLogout.setOnClickListener(this);
        layoutAbout.setOnClickListener(this);
        layoutProfile.setOnClickListener(this);
        layoutChangePin.setOnClickListener(this);

        layoutRedisite.setOnClickListener(this);

        return v;
    }

    private void initVariable() {
        iSettingPresenter = new SettingPresenter(this, context, getActivity());
        iSettingPresenter.initToolbar(toolBar);

        Bundle bundle = getArguments();
        if (bundle != null) {
            uid = bundle.getString("telehealthUID", "");
            iSettingPresenter.getInfoPatient(uid);
        }

        //init progressDialog
        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#B42047"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
        progressDialog.show();
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                    .setContentText(getResources().getString(R.string.token_expired))
                    .show();
        } else {
            new SweetAlertDialog(context, SweetAlertDialog.ERROR_TYPE)
                    .setContentText(msg)
                    .show();
        }
        progressDialog.dismiss();
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
        progressDialog.dismiss();
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
                iSettingPresenter.changeFragment(new HomeFragment());
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
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
            case R.id.layoutChangePin:
                iSettingPresenter.displayPin(uid);
                break;
            case R.id.layoutRedisite:
                iSettingPresenter.changeFragment(new RedisiteFragment());
        }
    }

    //Handler back button
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
                        iSettingPresenter.changeFragment(new HomeFragment());
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
