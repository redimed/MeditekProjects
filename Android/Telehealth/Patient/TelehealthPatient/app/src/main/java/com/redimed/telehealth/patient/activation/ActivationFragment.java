package com.redimed.telehealth.patient.activation;

import android.content.Context;
import android.os.Bundle;

import android.support.v4.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;

import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.activation.presenter.ActivationPresenter;
import com.redimed.telehealth.patient.activation.presenter.IActivationPresenter;
import com.redimed.telehealth.patient.activation.view.IActivationView;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;

public class ActivationFragment extends Fragment implements View.OnClickListener, IActivationView {

    private Context context;
    private String TAG = "ACTIVATION";
    private IActivationPresenter iActivationPresenter;

    @Bind(R.id.logo)
    ImageView mLogo;

    //=======Layout 1=========
    @Bind(R.id.btnRequestCode)
    Button btnRequestCode;
    @Bind(R.id.lblPhoneCode)
    TextView lblPhoneCode;
    @Bind(R.id.txtPhone)
    EditText txtPhone;

    //======Layout 2==========
    @Bind(R.id.btnSubmitCode)
    Button btnSubmitCode;
    @Bind(R.id.btnBack)
    RelativeLayout btnBack;
    @Bind(R.id.txtVerifyCode)
    EditText txtVerifyCode;

    @Bind(R.id.layoutContainer)
    ViewFlipper layoutContainer;
    @Bind(R.id.layoutRegisterFone)
    LinearLayout layoutRegisterFone;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_activation, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        //init variable
        iActivationPresenter = new ActivationPresenter(this, context, getActivity());
        iActivationPresenter.hideKeyboardFragment(v);
        layoutContainer.setAnimateFirstView(true);
        layoutContainer.setAlpha(0.0f);
        layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutRegisterFone));

        //init function
        animationLogo();
        animationContainer();

        //set listener
        btnSubmitCode.setOnClickListener(this);
        btnRequestCode.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        return v;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnRequestCode:
                btnRequestCode.setEnabled(false);
                iActivationPresenter.validatedPhone(lblPhoneCode.getText().toString(), txtPhone.getText().toString());
                break;
            case R.id.btnSubmitCode:
                iActivationPresenter.verifyCode(txtVerifyCode.getText().toString());
                break;
            case R.id.btnBack:
                txtPhone.setText("");
                switchView(R.anim.in_from_right, R.anim.out_to_left, layoutRegisterFone);
                break;
        }
    }

    @Override
    public void onValidate(String result) {
        if (!result.equalsIgnoreCase("wrong")) {
            iActivationPresenter.requestCode(result);
        } else {
            btnRequestCode.setEnabled(true);
            Toast.makeText(context, R.string.alert_wrong_phone, Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onRequestCode() {
        switchView(R.anim.in_from_left, R.anim.out_to_right, layoutRegisterFone);
    }

    @Override
    public void onLogin() {
        iActivationPresenter.changeFragment(new HomeFragment());
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else {
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
    }

    public void animationLogo() {
        Animation anim = AnimationUtils.loadAnimation(context, R.anim.translate_center_to_top);
        mLogo.startAnimation(anim);
    }

    public void animationContainer() {
        layoutContainer.animate().setStartDelay(1700).setDuration(500).alpha(1.0f);
    }

    public void switchView(int inAnimation, int outAnimation, View v) {
        layoutContainer.setInAnimation(context, inAnimation);
        layoutContainer.setOutAnimation(context, outAnimation);
        if (layoutContainer.indexOfChild(v) == 0)
            layoutContainer.showNext();
        else
            layoutContainer.showPrevious();
    }

    //close keyboard
//    @Override
//    public boolean dispatchTouchEvent(MotionEvent ev) {
//        View v = getCurrentFocus();
//        if (v != null &&
//                (ev.getAction() == MotionEvent.ACTION_UP || ev.getAction() == MotionEvent.ACTION_MOVE) &&
//                v instanceof EditText &&
//                !v.getClass().getName().startsWith("android.webkit.")) {
//            int scrcoords[] = new int[2];
//            v.getLocationOnScreen(scrcoords);
//            float x = ev.getRawX() + v.getLeft() - scrcoords[0];
//            float y = ev.getRawY() + v.getTop() - scrcoords[1];
//
//            if (x < v.getLeft() || x > v.getRight() || y < v.getTop() || y > v.getBottom()){
//                if (getWindow() != null && getWindow().getDecorView() != null) {
//                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
//                    imm.hideSoftInputFromWindow(getWindow().getDecorView().getWindowToken(), 0);
//                }
//            }
//        }
//        return super.dispatchTouchEvent(ev);
//    }
}
