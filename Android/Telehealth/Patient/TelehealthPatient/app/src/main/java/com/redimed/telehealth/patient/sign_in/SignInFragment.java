package com.redimed.telehealth.patient.sign_in;


import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
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
import com.redimed.telehealth.patient.login.LoginFragment;
import com.redimed.telehealth.patient.sign_in.presenter.ISignInPresenter;
import com.redimed.telehealth.patient.sign_in.presenter.SignInPresenter;
import com.redimed.telehealth.patient.sign_in.view.ISignInView;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class SignInFragment extends Fragment implements ISignInView, View.OnClickListener {

    private Context context;
    private SweetAlertDialog progressDialog;
    private ISignInPresenter iSignInPresenter;

    @Bind(R.id.txtPhone)
    EditText txtPhone;
    @Bind(R.id.btnContinue)
    Button btnContinue;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;

    public SignInFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_sign_in, container, false);
        ButterKnife.bind(this, v);
        this.context = v.getContext();

        init(v);
        initToolbar();

        btnContinue.setOnClickListener(this);

        return v;
    }

    private void init(View v) {
        iSignInPresenter = new SignInPresenter(context, this, getActivity());
        iSignInPresenter.hideKeyboardFragment(v);

        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
    }

    private void initToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.login));
        lblSubTitle.setText(getResources().getString(R.string.home_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iSignInPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onLoadSuccess() {
        progressDialog.dismiss();
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
//            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
//                    .setContentText(getResources().getString(R.string.token_expired))
//                    .show();
        } else {
            new SweetAlertDialog(context, SweetAlertDialog.ERROR_TYPE)
                    .setContentText(msg)
                    .show();
        }
        txtPhone.setText("");
        progressDialog.dismiss();
        btnContinue.setEnabled(true);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnContinue:
                progressDialog.show();
                btnContinue.setEnabled(false);
                iSignInPresenter.register(txtPhone.getText().toString());
                break;
            default:
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
                    iSignInPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
