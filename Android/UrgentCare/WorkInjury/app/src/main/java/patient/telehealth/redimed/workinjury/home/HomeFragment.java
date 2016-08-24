package patient.telehealth.redimed.workinjury.home;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Build;
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
import patient.telehealth.redimed.workinjury.home.presenter.HomePresenter;
import patient.telehealth.redimed.workinjury.home.presenter.IHomepresenter;
import patient.telehealth.redimed.workinjury.home.view.IHomeView;
import patient.telehealth.redimed.workinjury.login.LoginFragment;
import patient.telehealth.redimed.workinjury.redisite.patient.PatientRedisiteFragment;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.socket.SocketService;
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
    @Bind(R.id.btnRedisite) Button btnRedisite;
    @Bind(R.id.btnListTracking) Button btnListTracking;


    public HomeFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.context = getContext();
        iHomepresenter = new HomePresenter(getContext(), getActivity());
        isLogin = iHomepresenter.isLogin();
        sliderImageAdapter = new SliderImageAdapter(getContext());
        application = MyApplication.getInstance();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
//        getActivity().getWindow().setStatusBarColor(getResources().getColor(R.color.textColorPrimary));
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        TypefaceUtil.applyFont(context, view.findViewById(R.id.activityHome), Key.fontRoboto);

        ButterKnife.bind(this, view);

        if (isLogin){
            btnLogin.setVisibility(View.GONE);
            btnRedisite.setVisibility(View.VISIBLE);
            btnListTracking.setVisibility(View.VISIBLE);
            getActivity().startService(new Intent(getActivity(), SocketService.class));
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
        btnRedisite.setOnClickListener(this);

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
                iHomepresenter.displayFAQs(Key.FAQ.titleAboutUs);
                break;
            case R.id.btnOther:
                application.replaceFragment(new SettingFragment(),Key.fmSetting,Key.fmHome);
                break;
            case R.id.btnRehab:
                iHomepresenter.dispalyWork(Key.Work.rehab);
                break;
            case R.id.btnSpec:
                iHomepresenter.dispalyWork(Key.Work.specialistClinic);
                break;
            case R.id.btnGP:
                iHomepresenter.dispalyWork(Key.Work.generalClinic);
                break;
            case  R.id.btnLogin:
                application.replaceFragment(new LoginFragment(),Key.fmLogin,Key.fmHome);
                break;
            case  R.id.btnRedisite:
                application.CreateDataRedisite();
                application.replaceFragment(new PatientRedisiteFragment(), Key.fmRedisitePatient, Key.fmHome);
                break;
        }
    }
}
