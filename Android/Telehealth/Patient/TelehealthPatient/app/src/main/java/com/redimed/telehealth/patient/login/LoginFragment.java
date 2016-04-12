package com.redimed.telehealth.patient.login;

import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;

import android.support.v4.app.Fragment;

import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;

import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.login.presenter.LoginPresenter;
import com.redimed.telehealth.patient.login.presenter.ILoginPresenter;
import com.redimed.telehealth.patient.login.view.ILoginView;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.sign_in.SignInFragment;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

public class LoginFragment extends Fragment implements View.OnClickListener, ILoginView {

    private Bundle bundle;
    private Context context;
//    private boolean isActivated;
    private SweetAlertDialog progressDialog;
    private ILoginPresenter iLoginPresenter;
    private static final String TAG = "=====ACTIVATION=====";

    @Bind(R.id.logo)
    ImageView mLogo;

//    //=======Layout 1=========
//    @Bind(R.id.txtPin)
//    EditText txtPin;
//
//    //======Layout 2==========
//    @Bind(R.id.txtVerifyCode)
//    EditText txtVerifyCode;
//
//    @Bind(R.id.layoutContainer)
//    ViewFlipper layoutContainer;
//    @Bind(R.id.layoutRequestPin)
//    LinearLayout layoutRegisterPin;
//    @Bind(R.id.layoutVerifyCode)
//    LinearLayout layoutVerifyCode;

    @Bind(R.id.layoutContainer)
    LinearLayout layoutContainer;
    @Bind(R.id.txtCode)
    EditText txtCode;
    @Bind(R.id.btnLogin)
    Button btnLogin;

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
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_login, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        //init Presenter
        iLoginPresenter = new LoginPresenter(this, context, getActivity());
        iLoginPresenter.hideKeyboardFragment(v);

        //init variable
        init();
        initToolbar();

        //init animation function
        animationLogo();
        animationContainer();

        //set listener
        btnLogin.setOnClickListener(this);

        return v;
    }

    private void init() {
        bundle = this.getArguments();
//        if (bundle != null) {
//            isActivated = bundle.getBoolean("isActivated");
//        }

        layoutContainer.setAlpha(0.0f);
//        layoutContainer.setAnimateFirstView(true);
//        if (isActivated)
//            layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutRegisterPin));
//        else
//            layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutVerifyCode));

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
        lblSubTitle.setText(getResources().getString(R.string.back));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iLoginPresenter.changeFragment(new SignInFragment());
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnLogin:
                progressDialog.show();
                btnLogin.setEnabled(false);
                iLoginPresenter.verifyLogin(bundle, txtCode.getText().toString());
//                int currentView = layoutContainer.indexOfChild(layoutContainer.getCurrentView());
//                iLoginPresenter.validatedPhone(lblPhoneCode.getText().toString(), txtPhone.getText().toString());
                break;
            default:
                break;
        }
    }

//    @Override
//    public void onValidate(String result) {
//        if (!result.equalsIgnoreCase("wrong")) {
//            iLoginPresenter.requestCode(result);
//        } else {
//            btnRequestCode.setEnabled(true);
//            Toast.makeText(context, R.string.alert_wrong_phone, Toast.LENGTH_LONG).show();
//        }
//    }

//    @Override
//    public void onRequestCode() {
////        switchView(R.anim.in_from_left, R.anim.out_to_right, layoutRegisterFone);
//
//        //Set text  and icon title appointment details
//        lblTitle.setText(getResources().getString(R.string.activation_title));
//        lblSubTitle.setText(getResources().getString(R.string.back));
//        layoutBack.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
////                txtPhone.setText("");
////                btnRequestCode.setEnabled(true);
////                switchView(R.anim.in_from_right, R.anim.out_to_left, layoutRegisterFone);
//            }
//        });
//    }

    @Override
    public void onLogin() {
        progressDialog.dismiss();
        iLoginPresenter.changeFragment(new HomeFragment());
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
        txtCode.setText("");
        progressDialog.dismiss();
        btnLogin.setEnabled(true);
    }

    public void animationLogo() {
        Animation anim = AnimationUtils.loadAnimation(context, R.anim.translate_center_to_top);
        mLogo.startAnimation(anim);
    }

    public void animationContainer() {
        layoutContainer.animate().setStartDelay(1700).setDuration(500).alpha(1.0f);
    }

//    public void switchView(int inAnimation, int outAnimation, View v) {
//        layoutContainer.setInAnimation(context, inAnimation);
//        layoutContainer.setOutAnimation(context, outAnimation);
//        if (layoutContainer.indexOfChild(v) == 0)
//            layoutContainer.showNext();
//        else
//            layoutContainer.showPrevious();
//    }

    //Close keyboard activity
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

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iLoginPresenter.changeFragment(new SignInFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
