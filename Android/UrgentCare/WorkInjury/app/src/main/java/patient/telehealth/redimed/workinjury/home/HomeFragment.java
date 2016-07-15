package patient.telehealth.redimed.workinjury.home;

import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.view.ViewPager;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.support.v4.app.Fragment;
import android.widget.Button;
import android.widget.Toast;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.WorkActivity;
import patient.telehealth.redimed.workinjury.home.presenter.HomePresenter;
import patient.telehealth.redimed.workinjury.home.presenter.IHomepresenter;
import patient.telehealth.redimed.workinjury.home.view.IHomeView;
import patient.telehealth.redimed.workinjury.login.LoginFragment;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.PageIndicator;
import patient.telehealth.redimed.workinjury.utils.SliderImageAdapter;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;


/**
 * A simple {@link Fragment} subclass.
 */
public class HomeFragment extends Fragment implements IHomeView, View.OnClickListener {

    private Intent i;
    private SliderImageAdapter sliderImageAdapter;
    private int currentItem = 0;
    private boolean shouldFinish = false;
    private Context context;
    private IHomepresenter iHomepresenter;
    private boolean isLogin;
    private MyApplication application;


    @Bind(R.id.slider) ViewPager slider;
    @Bind(R.id.circleIndicator) PageIndicator circleIndicator;
    @Bind(R.id.btnCall) Button btnCall;
    @Bind(R.id.btnFAQ) Button btnFAQ;
    @Bind(R.id.btnUrgentCare) Button btnUrgent;
    @Bind(R.id.btnRehab) Button btnRehab;
    @Bind(R.id.btnSpec) Button btnSpec;
    @Bind(R.id.btnGP) Button btnGP;
    @Bind(R.id.btnOther) Button btnOther;
    @Bind(R.id.btnLogin) Button btnLogin;

    public HomeFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        iHomepresenter = new HomePresenter(context, getActivity());
        isLogin = iHomepresenter.isLogin();
        this.context = context;
        sliderImageAdapter = new SliderImageAdapter(context);
        application = MyApplication.getInstance();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        TypefaceUtil.applyFont(context, view.findViewById(R.id.activityHome), Key.fontRoboto);

        ButterKnife.bind(this, view);

        if (isLogin){
            btnLogin.setVisibility(View.GONE);
        }

        slider.setAdapter(sliderImageAdapter);
        circleIndicator.setViewPager(slider);
        final int totalPage = slider.getAdapter().getCount();
        final Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                circleIndicator.setCurrentItem(currentItem++);
                if (currentItem == totalPage) {
                    currentItem = 0;
                }
                handler.postDelayed(this, 4000);
            }
        };
        handler.postDelayed(runnable, 4000);

        btnCall.setTypeface(Typeface.createFromAsset(context.getAssets(), Key.fontRoboto), Typeface.BOLD);
        btnFAQ.setTypeface(Typeface.createFromAsset(context.getAssets(), Key.fontRoboto), Typeface.BOLD);
        btnUrgent.setTypeface(Typeface.createFromAsset(context.getAssets(), Key.fontRoboto), Typeface.BOLD);

        btnCall.setOnClickListener(this);
        btnFAQ.setOnClickListener(this);
        btnUrgent.setOnClickListener(this);
        btnRehab.setOnClickListener(this);
        btnSpec.setOnClickListener(this);
        btnGP.setOnClickListener(this);
        btnOther.setOnClickListener(this);
        btnLogin.setOnClickListener(this);

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    if (!shouldFinish) {
                        Toast.makeText(v.getContext(), Key.confirmExit, Toast.LENGTH_SHORT).show();
                        shouldFinish = true;
                        return true;
                    } else {
                        getActivity().moveTaskToBack(true);
                        getActivity().finish();
                        return false;
                    }
                }
                return false;
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnCall:
                iHomepresenter.Contact();
                break;
            case R.id.btnFAQ:
                iHomepresenter.displayFAQs(Key.FAQ.titleFAQs);
                break;
            case R.id.btnUrgentCare:
                iHomepresenter.displayFAQs(Key.FAQ.fileAboutUs);
                break;
            case R.id.btnOther:
                application.replaceFragment(getActivity(), new SettingFragment(),Key.fmSetting,Key.fmHome);
                break;
            case R.id.btnRehab:
                i = new Intent(context, WorkActivity.class);
                i.putExtra(Key.uRType, Key.rehab);
                startActivity(i);
                getActivity().finish();
                break;
            case R.id.btnSpec:
                i = new Intent(context, WorkActivity.class);
                i.putExtra(Key.uRType, Key.specialist);
                startActivity(i);
                getActivity().finish();
                break;
            case R.id.btnGP:
                i = new Intent(context, WorkActivity.class);
                i.putExtra(Key.uRType, Key.gp);
                startActivity(i);
                getActivity().finish();
                break;
            case  R.id.btnLogin:
                application.replaceFragment(getActivity() ,new LoginFragment(),Key.fmLogin,Key.fmHome);
                break;
        }
    }
}
