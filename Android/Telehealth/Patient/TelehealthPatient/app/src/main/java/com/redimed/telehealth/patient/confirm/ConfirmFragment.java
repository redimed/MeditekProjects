package com.redimed.telehealth.patient.confirm;


import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.confirm.presenter.ConfirmPresenter;
import com.redimed.telehealth.patient.confirm.presenter.IConfirmPresenter;
import com.redimed.telehealth.patient.confirm.view.IConfirmView;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class ConfirmFragment extends Fragment implements View.OnClickListener, IConfirmView {

    private Bundle bundle;
    private Context context;
    private boolean checkSign = false;
    private ArrayList<String> fileUploads;
    private SweetAlertDialog progressDialog;
    private IConfirmPresenter iConfirmPresenter;
    private String firstName, lastName, mobile, suburb, dob, email, currentDate, home, apptType, des, sign;
    private static final String TAG = "=====CONFIRM=====";

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
    @Bind(R.id.lblFAQs)
    TextView btnFAQs;

    /* Signature */
    @Bind(R.id.signaturePad)
    SignaturePad signaturePad;
    @Bind(R.id.vfContainer)
    ViewFlipper vfContainer;
    @Bind(R.id.lblClear)
    TextView btnClear;
    @Bind(R.id.lblSave)
    TextView btnSave;
    @Bind(R.id.layoutSubmit)
    LinearLayout layoutSubmit;
    @Bind(R.id.imgSignature)
    ImageView imgSignature;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;

    public ConfirmFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_confirm, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        init();
        initSignature();
        onLoadToolbar();

        btnFAQs.setOnClickListener(this);
        btnSave.setOnClickListener(this);
        btnClear.setOnClickListener(this);
        btnComplete.setOnClickListener(this);

        return v;
    }

//    @Override
//     public void onActivityCreated(Bundle savedInstanceState) {
//        super.onActivityCreated(savedInstanceState);
//        Log.d(TAG, savedInstanceState + " =activity");
//        //Restore the fragment's state here
//        if (savedInstanceState != null){
////            firstName = savedInstanceState.getString("firstName");
////            lastName = savedInstanceState.getString("lastName");
////            mobile = savedInstanceState.getString("mobile");
////            home = savedInstanceState.getString("home");
////            suburb = savedInstanceState.getString("suburb");
////            apptType = savedInstanceState.getString("apptType");
////            dob = savedInstanceState.getString("dob");
////            email = savedInstanceState.getString("email");
////            des = savedInstanceState.getString("des");
////            sign = savedInstanceState.getString("sign");
////            fileUploads = savedInstanceState.getStringArrayList("fileUploads");
//        }
//    }

//    //Save data
//    @Override
//    public void onSaveInstanceState(Bundle outState) {
//        Log.d(TAG, bundle + " =save");
//        super.onSaveInstanceState(outState);
//        //Save the fragment's state here
//        outState.putBundle("dataConfirm", bundle);
//    }
//
//    @Override
//    public void onDestroyView() {
//        super.onDestroyView();
//        bundle = saveState(); /* bundle defined here for sure */
//    }
//
//    private Bundle saveState() { /* called either from onDestroyView() or onSaveInstanceState() */
//        Bundle state = new Bundle();
//        state.putBundle("dataConfirm", bundle);
//        return state;
//    }

    private void init() {
        fileUploads = new ArrayList<String>();
        iConfirmPresenter = new ConfirmPresenter(context, this, getActivity());
        currentDate = iConfirmPresenter.getCurrentDateSystem();

        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);

        bundle = getArguments();
        if (bundle != null) {
            firstName = bundle.getString("firstName", "");
            lastName = bundle.getString("lastName", "");
            mobile = bundle.getString("mobile", "");
            home = bundle.getString("home", "");
            suburb = bundle.getString("suburb", "");
            apptType = bundle.getString("apptType", "");
            dob = bundle.getString("dob", "");
            email = bundle.getString("email", "");
            des = bundle.getString("des", "");
            fileUploads = bundle.getStringArrayList("fileUploads");

            if (!bundle.getString("sign").equalsIgnoreCase("")) {
                checkSign = true;
                sign = bundle.getString("sign", "");
                iConfirmPresenter.loadSignature(sign);
            }
        }
        showDataConfirm();
    }

    private void initSignature() {
        signaturePad.setOnSignedListener(new SignaturePad.OnSignedListener() {
            @Override
            public void onStartSigning() {
                Toast.makeText(context, "OnStartSigning", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onSigned() {
                btnSave.setEnabled(true);
                btnClear.setEnabled(true);
            }

            @Override
            public void onClear() {
                btnSave.setEnabled(false);
                btnClear.setEnabled(false);
            }
        });
    }

    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.res_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iConfirmPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    private void showDataConfirm() {
        lblNamePatient.setText(firstName + " " + lastName);
        lblDOB.setText(dob);
        lblEmail.setText(email);
        lblPhone.setText(mobile);
        lblSuburb.setText(suburb);
        lblRequestDate.setText(currentDate);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblSave:
                iConfirmPresenter.saveBitmapSign(signaturePad);
                break;
            case R.id.lblClear:
                signaturePad.clear();
                break;
            case R.id.lblComplete:
                if (!iConfirmPresenter.isCheckPatientConsent(chkConsent1, chkConsent2, chkConsent3)) {
                    Toast.makeText(context, "Please accept consent and submit booking request", Toast.LENGTH_SHORT).show();
                } else {
                    progressDialog.show();
                    iConfirmPresenter.completeRequest(bundle, fileUploads, currentDate);
                }
                break;
            case R.id.lblFAQs:
                iConfirmPresenter.displayFAQs(bundle);
                break;
        }
    }

    @Override
    public void onLoadSuccess() {
        progressDialog.dismiss();
        iConfirmPresenter.changeFragment(new HomeFragment());
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
    public void onLoadImgSignature(Bitmap bitmap, String path) {
        if (bitmap != null) {
            imgSignature.setImageBitmap(bitmap);
            vfContainer.setDisplayedChild(vfContainer.indexOfChild(layoutSubmit));
            if (!checkSign){
                iConfirmPresenter.uploadNonLogin(path);
            }
        }
    }
}
