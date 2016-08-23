package patient.telehealth.redimed.workinjury.pin;

import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.pin.presenter.IPinPresenter;
import patient.telehealth.redimed.workinjury.pin.presenter.PinPresenter;
import patient.telehealth.redimed.workinjury.pin.view.IPinView;
import patient.telehealth.redimed.workinjury.utils.DialogConnection;
import patient.telehealth.redimed.workinjury.utils.Key;

public class PinFragment extends Fragment implements IPinView, View.OnClickListener {

    private String TAG = Key.Pin.TAG;
    private IPinPresenter iPinPresenter;
    private SweetAlertDialog progressDialog;
    private MyApplication application;

    @Bind(R.id.layoutChangePin) LinearLayout layoutChangePin;

    @Bind(R.id.btnSubmit) Button btnSubmit;

    public PinFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        iPinPresenter = new PinPresenter(this);
        application = MyApplication.getInstance();
        progressDialog = new SweetAlertDialog(getContext(), SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.alpha(R.color.progressDialogBarColor));
        progressDialog.setTitleText(getString(R.string.loadding));
        progressDialog.setCancelable(false);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        final View v = inflater.inflate(R.layout.fragment_pin, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);
        application.hidenKeyboard(v);
        application.createTooBarTitle(v, Key.fmChangePin);

        btnSubmit.setOnClickListener(this);

        return v;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(Key.fmSetting, Key.fmHome);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onLoadSuccess() {
        progressDialog.dismiss();
        application.replaceFragment(new HomeFragment(), Key.fmHome, null);
    }

    @Override
    public void onLoadError(String msg) {
        try {
            if (msg.equalsIgnoreCase(Key.networkError)) {
                new DialogConnection(getActivity()).show();
            } else if (msg.equalsIgnoreCase(Key.tokenExpiredError)) {
                new SweetAlertDialog(getActivity(), SweetAlertDialog.WARNING_TYPE)
                        .setContentText(getResources().getString(R.string.token_expired))
                        .show();
            } else {
                new SweetAlertDialog(getActivity(), SweetAlertDialog.ERROR_TYPE)
                        .setContentText(msg)
                        .show();
            }
            progressDialog.dismiss();
            btnSubmit.setEnabled(true);
        }catch (Exception e){
            Log.d(TAG,e.getMessage());
        }
    }

    @Override
    public void onResultField(EditText editText) {
        progressDialog.dismiss();
        btnSubmit.setEnabled(true);
        editText.setError(getResources().getString(R.string.error_pin));
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnSubmit:
                progressDialog.show();
                btnSubmit.setEnabled(false);
                iPinPresenter.checkDataField(layoutChangePin);
                break;
        }
    }
}
