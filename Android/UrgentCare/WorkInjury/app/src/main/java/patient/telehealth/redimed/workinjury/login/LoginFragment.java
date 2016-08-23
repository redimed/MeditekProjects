package patient.telehealth.redimed.workinjury.login;


import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.Toast;
import android.widget.ViewFlipper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.login.presendter.ILoginPresenter;
import patient.telehealth.redimed.workinjury.login.presendter.LoginPresenter;
import patient.telehealth.redimed.workinjury.login.view.ILoginView;
import patient.telehealth.redimed.workinjury.utils.Key;

/**
 * A simple {@link Fragment} subclass.
 */
public class LoginFragment extends Fragment implements ILoginView, View.OnClickListener, RadioGroup.OnCheckedChangeListener {

    @Bind(R.id.logo) ImageView mLogo;
    @Bind(R.id.radioGroupTypeLogin) RadioGroup radioGroupTypeLogin;
    @Bind(R.id.btnLoginCompany) Button btnLoginCompany;
    @Bind(R.id.txtPassWord) EditText txtPassWord;
    @Bind(R.id.txtUserName) EditText txtUserName;

    //=======Layout 1=========
    @Bind(R.id.btnCheckActivation) Button btnCheckActivation;
    @Bind(R.id.txtPhone) EditText txtPhone;

    //======Layout 2==========
    @Bind(R.id.btnSubmitPinNumber) Button btnSubmitPinNumber;
    @Bind(R.id.btnForgetPin) Button btnForgetPin;
    @Bind(R.id.txtVerifyCode) EditText txtVerifyCode;

    @Bind(R.id.layoutContainer) ViewFlipper layoutContainer;
    @Bind(R.id.layoutLogin) ViewFlipper layoutLogin;
    @Bind(R.id.layoutRegisterFone) LinearLayout layoutRegisterFone;
    @Bind(R.id.layoutPerson) LinearLayout layoutPerson;
    @Bind(R.id.layoutCompany) LinearLayout layoutCompany;



    private Context context;
    private ILoginPresenter iLoginPresenter;
    private MyApplication application;
    public LoginFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        application = MyApplication.getInstance();
        iLoginPresenter = new LoginPresenter(this, getActivity());
        this.context = getContext();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        ButterKnife.bind(this, view);

        setHasOptionsMenu(true);
        application.createTooBarTitle(view, Key.fmLogin);
        application.hidenKeyboard(view);

        layoutContainer.setAnimateFirstView(true);
        layoutContainer.setAlpha(0.0f);
        layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutRegisterFone));

        layoutLogin.setDisplayedChild(layoutLogin.indexOfChild(layoutPerson));

        //init function
        //animationLogo();
        animationContainer();

        //set listener
        btnSubmitPinNumber.setOnClickListener(this);
        btnCheckActivation.setOnClickListener(this);
        btnForgetPin.setOnClickListener(this);
        radioGroupTypeLogin.setOnCheckedChangeListener(this);
        btnLoginCompany.setOnClickListener(this);

        return view;
    }

    public void animationContainer() {
        layoutContainer.animate().setStartDelay(200).setDuration(500).alpha(1.0f);
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
            case R.id.btnCheckActivation:
                application.hidenKeyboard(txtPhone);
                iLoginPresenter.validatedPhone(phone);
                break;
            case R.id.btnSubmitPinNumber:
                application.hidenKeyboard(txtVerifyCode);
                String verityCode = txtVerifyCode.getText().toString();
                iLoginPresenter.Login(verityCode);
                break;
            case R.id.btnForgetPin:
                iLoginPresenter.ForgetPin(phone);
                break;
            case R.id.btnLoginCompany:
                String username = String.valueOf(txtUserName.getText());
                String password = String.valueOf(txtPassWord.getText());
                iLoginPresenter.LoginAccount(username, password);
                break;
        }
    }

    @Override
    public void ResponseSuccess() {
        switchView(R.anim.in_from_left, R.anim.out_to_right, layoutRegisterFone);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(Key.fmHome,null);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onCheckedChanged(RadioGroup radioGroup, int i) {
        switch (i) {
            case R.id.loginPerson:
                layoutLogin.showPrevious();
                break;
            case R.id.loginCompany:
                layoutLogin.showNext();
                break;
            default:
                break;
        }
    }

    @Override
    public void onValidated(String result) {
        if (!result.equalsIgnoreCase("wrong")) {
            iLoginPresenter.CheckActivation(result);
        } else {
            application.FunctionError(getActivity().getResources().getString(R.string.alert_wrong_phone));
        }
    }
}
