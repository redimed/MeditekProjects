package patient.telehealth.redimed.workinjury.redisite.consent;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.ViewFlipper;

import org.jdeferred.DoneCallback;
import org.jdeferred.FailCallback;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.model.ModelGeneral;
import patient.telehealth.redimed.workinjury.redisite.consent.presenter.ConsentPresenter;
import patient.telehealth.redimed.workinjury.redisite.consent.presenter.IConsentPresenter;
import patient.telehealth.redimed.workinjury.redisite.consent.view.IConsentView;
import patient.telehealth.redimed.workinjury.redisite.image.ImageFragment;
import patient.telehealth.redimed.workinjury.utils.DialogConnection;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.views.SignaturePad;
import retrofit.RetrofitError;

public class ConsentFragment extends Fragment implements IConsentView, View.OnClickListener {

    private Context context;
    private IConsentPresenter iConsentPresenter;
    private static final String TAG = "=====CONSENT=====";
    private MyApplication application;
    private List<ModelGeneral.TempDataBean> dataConsent;


    @Bind(R.id.cbConsent1) CheckBox cbConsent1;
    @Bind(R.id.cbConsent2) CheckBox cbConsent2;
    @Bind(R.id.txtSupervisor) EditText txtSupervisor;
    @Bind(R.id.cbConsent3) CheckBox cbConsent3;
    @Bind(R.id.cbConsent4) CheckBox cbConsent4;

    /* Signature */
    @Bind(R.id.signaturePad) SignaturePad signaturePad;
    @Bind(R.id.vfContainer) ViewFlipper vfContainer;
    @Bind(R.id.lblClear) TextView btnClear;
    @Bind(R.id.lblSave) TextView btnSave;
    @Bind(R.id.layoutSubmit) LinearLayout layoutSubmit;
    @Bind(R.id.imgSignature) ImageView imgSignature;

    @Bind(R.id.lblComplete) TextView btnComplete;

    public ConsentFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        application = MyApplication.getInstance();
        dataConsent =  application.getTempDataConsent();
        if (getArguments() != null) {
            Log.d(TAG, getArguments().getString("flagFragment"));
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        View v = inflater.inflate(R.layout.fragment_consent, container, false);
        this.context = v.getContext();
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);

        application.hidenKeyboard(v);
        application.createTooBarLogo(v);
        iConsentPresenter = new ConsentPresenter(context, this);

        if (dataConsent.size() > 0){
            getDataConsent(dataConsent);
        }

        initSignature();

        btnSave.setOnClickListener(this);
        btnClear.setOnClickListener(this);
        btnComplete.setOnClickListener(this);

        return v;
    }

    private void getDataConsent(List<ModelGeneral.TempDataBean> list) {
        for (ModelGeneral.TempDataBean item: list) {
            switch (item.getName()) {
                case "is_discuss":
                    cbConsent1.isChecked();
                    break;
                case "is_claim":
                    cbConsent2.isChecked();
                    break;
                case "is_third_party":
                    cbConsent3.isChecked();
                    break;
                case "is_correct":
                    cbConsent4.isChecked();
                    break;
                case "third_party_name":
                    txtSupervisor.setText(item.getValue());
                    break;
                default:
                    break;
            }
        }
    }

    private void initSignature() {
        signaturePad.setOnSignedListener(new SignaturePad.OnSignedListener() {
            @Override
            public void onStartSigning() {
                //Toast.makeText(context, "OnStartSigning", Toast.LENGTH_SHORT).show();
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
                application.setTempDataConsent(application.EformCheckbox("is_discuss", "row_2_26", "yes", "true", "field_2_26_0"));
                application.setTempDataConsent(application.EformCheckbox("is_claim", "row_2_27", "yes", "true", "field_2_27_0"));
                application.setTempDataConsent(application.EformCheckbox("is_third_party", "row_2_28", "yes", "true", "field_2_28_0"));
                application.setTempDataConsent(application.EformCheckbox("is_correct", "field_2_29_0", "yes", "true", "row_2_29"));
                application.setTempDataConsent(application.EformText("third_party_name", "field_2_28_2", String.valueOf(txtSupervisor.getText()) ,"row_2_28"));

                if (cbConsent1.isChecked() && cbConsent2.isChecked() && cbConsent3.isChecked() && cbConsent4.isChecked()) {

                    final SweetAlertDialog pDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
                    pDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
                    pDialog.setTitleText("");
                    pDialog.setContentText("Loading");
                    pDialog.setCancelable(false);
                    pDialog.show();


                    iConsentPresenter.submitRedisite().then(new DoneCallback() {
                        @Override
                        public void onDone(Object result) {
                            pDialog.dismiss();

                            SweetAlertDialog sDialog = new SweetAlertDialog(context, SweetAlertDialog.SUCCESS_TYPE);
                            sDialog.setTitleText("");
                            sDialog.setContentText("Send Redisite Success!");
                            sDialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                                @Override
                                public void onClick(SweetAlertDialog sDialog) {
                                    sDialog.dismissWithAnimation();
                                    application.replaceFragment(new HomeFragment(), Key.fmHome, null);
                                }
                            });
                            sDialog.show();

                        }
                    }, new FailCallback() {
                        @Override
                        public void onFail(Object result) {
                            pDialog.dismiss();
                            if (result != null){
                                RetrofitError error = (RetrofitError) result;
                                onLoadError(error.getMessage());
                            }
                        }
                    });
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

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                if (application.getRedisiteInjury())
                    application.replaceFragment(new ImageFragment(), Key.fmRedisiteImage, Key.fmRedisiteInjury);
                else
                    application.replaceFragment(new ImageFragment(), Key.fmRedisiteImage, Key.fmRedisiteIllness);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}

