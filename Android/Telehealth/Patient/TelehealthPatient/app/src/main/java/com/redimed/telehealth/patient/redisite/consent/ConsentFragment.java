package com.redimed.telehealth.patient.redisite.consent;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.redisite.consent.presenter.ConsentPresenter;
import com.redimed.telehealth.patient.redisite.consent.presenter.IConsentPresenter;
import com.redimed.telehealth.patient.redisite.consent.view.IConsentView;
import com.redimed.telehealth.patient.views.SignaturePad;
import com.redimed.telehealth.patient.widget.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

public class ConsentFragment extends Fragment implements IConsentView, View.OnClickListener {

    private Context context;
    private IConsentPresenter iConsentPresenter;
    private static final String TAG = "=====CONSENT=====";

    @Bind(R.id.cbConsent1)
    CheckBox cbConsent1;
    @Bind(R.id.cbConsent2)
    CheckBox cbConsent2;
    @Bind(R.id.txtSupervisor)
    EditText txtSupervisor;
    @Bind(R.id.cbConsent3)
    CheckBox cbConsent3;
    @Bind(R.id.cbConsent4)
    CheckBox cbConsent4;

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

    @Bind(R.id.lblComplete)
    TextView btnComplete;

    public ConsentFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        Bundle bundle = getArguments();
        if (bundle != null) {
            Log.d(TAG, bundle.getString("flagFragment"));
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        View v = inflater.inflate(R.layout.fragment_consent, container, false);
        this.context = v.getContext();
        ButterKnife.bind(this, v);

        iConsentPresenter = new ConsentPresenter(context, getActivity(), this);

        initSignature();

        btnSave.setOnClickListener(this);
        btnClear.setOnClickListener(this);
        btnComplete.setOnClickListener(this);

        return v;
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

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblSave:
                iConsentPresenter.uploadSignature(signaturePad);
                break;
            case R.id.lblClear:
                signaturePad.clear();
                break;
            case R.id.lblComplete:
                if (cbConsent1.isChecked() && cbConsent2.isChecked() && cbConsent3.isChecked() && cbConsent4.isChecked()) {
                    iConsentPresenter.submitRedisite(txtSupervisor.getText().toString(), getArguments());
                } else {
                    new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                            .setContentText(getString(R.string.confirm_alert)).show();
                }
                break;
        }
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
    }

    @Override
    public void onLoadImgSignature(Bitmap bitmap) {
        if (bitmap != null) {
            imgSignature.setImageBitmap(bitmap);
            vfContainer.setDisplayedChild(vfContainer.indexOfChild(layoutSubmit));
        }
    }
}

