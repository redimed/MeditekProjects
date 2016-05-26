package patient.telehealth.redimed.workinjury.login;


import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
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
import android.widget.ViewFlipper;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.login.presendter.ILoginPresenter;
import patient.telehealth.redimed.workinjury.login.presendter.LoginPresenter;
import patient.telehealth.redimed.workinjury.login.view.ILoginView;

/**
 * A simple {@link Fragment} subclass.
 */
public class LoginFragment extends Fragment implements ILoginView, View.OnClickListener {

    @Bind(R.id.btnBack) Button btnBack;
    @Bind(R.id.logo) ImageView mLogo;

    //=======Layout 1=========
    @Bind(R.id.btnCheckActivation) Button btnCheckActivation;
    @Bind(R.id.txtPhone) EditText txtPhone;

    //======Layout 2==========
    @Bind(R.id.btnSubmitPinNumber) Button btnSubmitPinNumber;
    @Bind(R.id.btnForgetPin) Button btnForgetPin;
    @Bind(R.id.txtVerifyCode) EditText txtVerifyCode;

    @Bind(R.id.layoutContainer) ViewFlipper layoutContainer;
    @Bind(R.id.layoutRegisterFone) LinearLayout layoutRegisterFone;

    private Context context;
    private ILoginPresenter iLoginPresenter;
    public LoginFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        context = view.getContext();

        ButterKnife.bind(this, view);

        iLoginPresenter = new LoginPresenter(this, getActivity());

        layoutContainer.setAnimateFirstView(true);
        layoutContainer.setAlpha(0.0f);
        layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutRegisterFone));

        //init function
        animationLogo();
        animationContainer();

        //set listener
        btnSubmitPinNumber.setOnClickListener(this);
        btnCheckActivation.setOnClickListener(this);
        btnBack.setOnClickListener(this);
        btnForgetPin.setOnClickListener(this);

        return view;
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

    @Override
    public void onClick(View v) {
        String phone = txtPhone.getText().toString();
        switch (v.getId()) {
            case R.id.btnBack:
                MyApplication.getInstance().replaceFragment(getActivity(), new HomeFragment());
                break;
            case R.id.btnCheckActivation:
                iLoginPresenter.CheckActivation(phone);
                break;
            case R.id.btnSubmitPinNumber:
                String verityCode = txtVerifyCode.getText().toString();
                iLoginPresenter.Login(verityCode);
                MyApplication.getInstance().hidenKeyboard(getView());
                break;
            case R.id.btnForgetPin:
                iLoginPresenter.ForgetPin(phone);
                break;
        }
    }

    @Override
    public void ResponseSuccess() {
        switchView(R.anim.in_from_left, R.anim.out_to_right, layoutRegisterFone);
        MyApplication.getInstance().hidenKeyboard(getView());
    }

    @Override
    public void ResponseError() {

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
                    MyApplication.getInstance().replaceFragment(getActivity(), new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
