package com.redimed.telehealth.patient.confirm;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.confirm.presenter.ConfirmPresenter;
import com.redimed.telehealth.patient.confirm.presenter.IConfirmPresenter;
import com.redimed.telehealth.patient.confirm.view.IConfirmView;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

public class ConfirmActivity extends AppCompatActivity implements IConfirmView, View.OnClickListener {

    private Intent i;
    private ArrayList<String> fileUploads;
    private IConfirmPresenter iConfirmPresenter;
    private String TAG = "=====CONFIRM=====", firstName, lastName, mobile, home, suburb, apptType, dob, email, des, currentDate;

    @Bind(R.id.lblRequestDate)
    TextView lblRequestDate;
    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.lblPhone)
    TextView lblPhone;
    @Bind(R.id.lblSuburb)
    TextView lblSuburb;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;

    @Bind(R.id.chkConsent1)
    CheckBox chkConsent1;
    @Bind(R.id.chkConsent2)
    CheckBox chkConsent2;
    @Bind(R.id.chkConsent3)
    CheckBox chkConsent3;
    @Bind(R.id.lblComplete)
    TextView btnComplete;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_confirm);
        ButterKnife.bind(this);

        init();
        onLoadToolbar();

        btnComplete.setOnClickListener(this);
    }

    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = this;
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.confirm_title));
        lblSubTitle.setText(getResources().getString(R.string.back));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    private void init() {
        fileUploads = new ArrayList<String>();
        iConfirmPresenter = new ConfirmPresenter(this, this, this);
        currentDate = iConfirmPresenter.getCurrentDateSystem();

        i = getIntent();
        if (i != null) {
            firstName = i.getStringExtra("firstName");
            lastName = i.getStringExtra("lastName");
            mobile = i.getStringExtra("mobile");
            home = i.getStringExtra("home");
            suburb = i.getStringExtra("suburb");
            apptType = i.getStringExtra("apptType");
            dob = i.getStringExtra("dob");
            email = i.getStringExtra("email");
            des = i.getStringExtra("des");

            fileUploads = i.getStringArrayListExtra("fileUploads");
        }
        showDataConfirm();
    }

    private void showDataConfirm() {
        lblNamePatient.setText(firstName + " " + lastName);
        lblPhone.setText(mobile);
        lblSuburb.setText(suburb);
        lblDOB.setText(dob);
        lblEmail.setText(email);
        lblRequestDate.setText(currentDate);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblComplete:
                if (!iConfirmPresenter.isCheckPatientConsent(chkConsent1, chkConsent2, chkConsent3)) {
                    Toast.makeText(ConfirmActivity.this, "Please accept consent and submit booking request", Toast.LENGTH_SHORT).show();
                } else {
                    iConfirmPresenter.completeRequest(i, fileUploads, currentDate);
                }
                break;
        }
    }

    @Override
    public void onLoadSuccess() {
        Intent returnIntent = new Intent(Intent.ACTION_PICK);
        setResult(Activity.RESULT_OK, returnIntent);
        finish();
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(this).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(this, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(this, DialogAlert.State.Error, msg).show();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
