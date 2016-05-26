package com.redimed.telehealth.patient.login;

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
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

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
    private SweetAlertDialog progressDialog;
    private ILoginPresenter iLoginPresenter;
    private static final String TAG = "=====ACTIVATION=====";

    @Bind(R.id.layoutLogo)
    RelativeLayout layoutLogo;
    @Bind(R.id.logo)
    ImageView mLogo;
    @Bind(R.id.layoutContainer)
    LinearLayout layoutContainer;
    @Bind(R.id.txtCode)
    EditText txtCode;
    @Bind(R.id.btnLogin)
    Button btnLogin;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        setHasOptionsMenu(true);
        context = view.getContext();
        ButterKnife.bind(this, view);

        //init Presenter
        iLoginPresenter = new LoginPresenter(this, context, getActivity());
        iLoginPresenter.initToolbar(toolBar);
        iLoginPresenter.hideKeyboardFragment(view);

        //init variable
        init();

        //init animation function
        animationLogo();
        animationContainer();

        //set listener
        btnLogin.setOnClickListener(this);

        return view;
    }

    private void init() {
        bundle = this.getArguments();
        layoutContainer.setAlpha(0.0f);

        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);

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
                iLoginPresenter.changeFragment(new SignInFragment());
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnLogin:
                progressDialog.show();
                btnLogin.setEnabled(false);
                iLoginPresenter.verifyLogin(bundle, txtCode.getText().toString());
                break;
            default:
                break;
        }
    }

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
        anim.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationStart(Animation animation) {
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }

            @Override
            public void onAnimationEnd(Animation animation) {
                mLogo.setVisibility(View.GONE);
            }
        });
        layoutLogo.startAnimation(anim);

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
        if (getView() != null) {
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
}
