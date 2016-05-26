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
import patient.telehealth.redimed.workinjury.FAQsActivity;
import patient.telehealth.redimed.workinjury.LoginActivity;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.SettingActivity;
import patient.telehealth.redimed.workinjury.WorkActivity;
import patient.telehealth.redimed.workinjury.home.presenter.HomePresenter;
import patient.telehealth.redimed.workinjury.home.presenter.IHomepresenter;
import patient.telehealth.redimed.workinjury.home.view.IHomeView;
import patient.telehealth.redimed.workinjury.login.LoginFragment;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
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
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        context = view.getContext();

        TypefaceUtil.applyFont(context, view.findViewById(R.id.activityHome), "fonts/Roboto-Regular.ttf");
        ButterKnife.bind(this, view);


        iHomepresenter = new HomePresenter(context);
        if (iHomepresenter.isCompany()){
            btnLogin.setVisibility(View.GONE);
        }


        sliderImageAdapter = new SliderImageAdapter(context);
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

        btnCall.setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/Roboto-Regular.ttf"), Typeface.BOLD);
        btnFAQ.setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/Roboto-Regular.ttf"), Typeface.BOLD);
        btnUrgent.setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/Roboto-Regular.ttf"), Typeface.BOLD);

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
                        Toast.makeText(v.getContext(), R.string.confirm_exit, Toast.LENGTH_SHORT).show();
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
                i = new Intent(context, FAQsActivity.class);
                i.putExtra("doc", "faq");
                startActivity(i);
                getActivity().finish();
                break;
            case R.id.btnUrgentCare:
                i = new Intent(context, FAQsActivity.class);
                i.putExtra("doc", "urgent");
                startActivity(i);
                getActivity().finish();
                break;
            case R.id.btnOther:
                MyApplication.getInstance().replaceFragment(getActivity(), new SettingFragment());
                break;
            case R.id.btnRehab:
                i = new Intent(context, WorkActivity.class);
                i.putExtra("URType", "rehab");
                startActivity(i);
                getActivity().finish();
                break;
            case R.id.btnSpec:
                i = new Intent(context, WorkActivity.class);
                i.putExtra("URType", "specialist");
                startActivity(i);
                getActivity().finish();
                break;
            case R.id.btnGP:
                i = new Intent(context, WorkActivity.class);
                i.putExtra("URType", "gp");
                startActivity(i);
                getActivity().finish();
                break;
            case  R.id.btnLogin:
                MyApplication.getInstance().replaceFragment(getActivity() ,new LoginFragment());
                break;
        }
    }
}
