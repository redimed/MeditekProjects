package com.redimed.telehealth.patient.pin;


import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.pin.presenter.IPinPresenter;
import com.redimed.telehealth.patient.pin.presenter.PinPresenter;
import com.redimed.telehealth.patient.pin.view.IPinView;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

public class PinFragment extends Fragment implements IPinView {

    private Context context;
    private Fragment fragment;
    private IPinPresenter iPinPresenter;
    private SweetAlertDialog progressDialog;
    private static final String TAG = "=====PIN=====";

    @Bind(R.id.layoutChangePin)
    LinearLayout layoutChangePin;
//    @Bind(R.id.txtCurrentPin)
//    EditText txtCurrentPin;
//    @Bind(R.id.txtNewPin)
//    EditText txtNewPin;
//    @Bind(R.id.txtConfirmPin)
//    EditText txtConfirmPin;

    @Bind(R.id.btnSubmit)
    Button btnSubmit;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;

    public PinFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        final View v = inflater.inflate(R.layout.fragment_pin, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        init(v);
        onLoadToolbar();

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                new Handler().postDelayed(new Runnable() {
//                    @Override
//                    public void run() {
//                        Log.d(TAG, "RUN TIME");
//                    }
//                }, 5000);
                progressDialog.show();
                btnSubmit.setEnabled(false);
                iPinPresenter.checkDataField(layoutChangePin);
            }
        });

        return v;
    }

    private void init(View v) {

        iPinPresenter = new PinPresenter(this, context, getActivity());
        iPinPresenter.hideKeyboardFragment(v);

        //init progressDialog
        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#B42047"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
    }

    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.pin_title));
        lblSubTitle.setText(getResources().getString(R.string.setting_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fragment = new SettingFragment();
                fragment.setArguments(getArguments());
                iPinPresenter.changeFragment(fragment);
            }
        });
    }

    @Override
    public void onLoadSuccess() {
        progressDialog.dismiss();
        iPinPresenter.changeFragment(new HomeFragment());
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
        btnSubmit.setEnabled(true);
    }

    @Override
    public void onResultField(EditText editText) {
        progressDialog.dismiss();
        btnSubmit.setEnabled(true);
        editText.setError(getResources().getString(R.string.error_pin));
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
                    fragment = new SettingFragment();
                    fragment.setArguments(getArguments());
                    iPinPresenter.changeFragment(fragment);
                    return true;
                }
                return false;
            }
        });
    }
}
