package patient.telehealth.redimed.workinjury.login;


import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
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
import patient.telehealth.redimed.workinjury.login.presendter.ILoginPresenter;
import patient.telehealth.redimed.workinjury.login.presendter.LoginPresenter;
import patient.telehealth.redimed.workinjury.login.view.ILoginView;
import patient.telehealth.redimed.workinjury.utils.Key;

/**
 * A simple {@link Fragment} subclass.
 */
public class LoginFragment extends Fragment implements ILoginView, View.OnClickListener {

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
    private MyApplication application;
    public LoginFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        application = MyApplication.getInstance();
        iLoginPresenter = new LoginPresenter(this, getActivity());
        this.context = context;

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        ButterKnife.bind(this, view);

        setHasOptionsMenu(true);
        application.createTooBar(view,getActivity(), Key.fmLogin);

        layoutContainer.setAnimateFirstView(true);
        layoutContainer.setAlpha(0.0f);
        layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutRegisterFone));

        //init function
        animationLogo();
        animationContainer();

        //set listener
        btnSubmitPinNumber.setOnClickListener(this);
        btnCheckActivation.setOnClickListener(this);
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
            case R.id.btnCheckActivation:
                application.hidenKeyboard(getView());
                iLoginPresenter.CheckActivation(phone);
                break;
            case R.id.btnSubmitPinNumber:
                application.hidenKeyboard(getView());
                String verityCode = txtVerifyCode.getText().toString();
                iLoginPresenter.Login(verityCode);
                break;
            case R.id.btnForgetPin:
                iLoginPresenter.ForgetPin(phone);
                break;
        }
    }

    @Override
    public void ResponseSuccess() {
        switchView(R.anim.in_from_left, R.anim.out_to_right, layoutRegisterFone);
    }

    @Override
    public void ResponseError() {

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(getActivity(),Key.fmHome,null);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
