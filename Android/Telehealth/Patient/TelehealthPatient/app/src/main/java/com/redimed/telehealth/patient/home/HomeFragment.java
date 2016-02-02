package com.redimed.telehealth.patient.home;


import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.presenter.HomePresenter;
import com.redimed.telehealth.patient.home.presenter.IHomePresenter;
import com.redimed.telehealth.patient.home.view.IHomeView;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.utlis.PageIndicator;
import com.redimed.telehealth.patient.utlis.AdapterSlider;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class HomeFragment extends Fragment implements IHomeView, View.OnClickListener {

    private Context context;
    private int currentItem = 0;
    private boolean shouldFinish = false;
    private IHomePresenter iHomePresenter;
    private String TAG = "HOME";

    /* Non Patient View */
    @Bind(R.id.layoutNonPatient)
    LinearLayout layoutNonPatient;
    @Bind(R.id.btnLogin)
    TextView btnLogin;
    @Bind(R.id.btnRequestNon)
    Button btnRequestNon;
    @Bind(R.id.btnServiceNon)
    Button btnServiceNon;

    /* Patient View */
    @Bind(R.id.layoutPatient)
    LinearLayout layoutPatient;
    @Bind(R.id.btnRequest)
    Button btnRequest;
    @Bind(R.id.btnTracking)
    Button btnTracking;
    @Bind(R.id.btnSetting)
    Button btnSetting;
    @Bind(R.id.btnService)
    Button btnService;

    /* Both View */
    @Bind(R.id.slider)
    ViewPager slider;
    @Bind(R.id.circleIndicator)
    PageIndicator circleIndicator;

    @Bind(R.id.vfHome)
    ViewFlipper vfHome;
    @Bind(R.id.btnContact)
    Button btnContact;
    @Bind(R.id.btnFAQ)
    Button btnFAQ;
    @Bind(R.id.btnUrgentCare)
    Button btnUrgentCare;

    public HomeFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_home, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);
        initSlider();

        iHomePresenter = new HomePresenter(this, context, getActivity());
        iHomePresenter.checkExistsPatient();
        iHomePresenter.createJsonDataSuburb();

        /* Non Patient View */
        btnLogin.setOnClickListener(this);
        btnRequestNon.setOnClickListener(this);
        btnServiceNon.setOnClickListener(this);

        /* Patient View */
        btnRequest.setOnClickListener(this);
        btnTracking.setOnClickListener(this);
        btnSetting.setOnClickListener(this);
        btnService.setOnClickListener(this);

        /* Both View */
        btnContact.setOnClickListener(this);
        btnFAQ.setOnClickListener(this);
        btnUrgentCare.setOnClickListener(this);

        return v;
    }

    //Generation Slider Image
    private void initSlider() {

        AdapterSlider adapterSlider = new AdapterSlider(context);
        slider.setAdapter(adapterSlider);
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
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {

            /* Non Patient View */
            case R.id.btnLogin:
                iHomePresenter.login();
                break;
            case R.id.btnRequestNon:
                iHomePresenter.displayRequest();
                break;
            case R.id.btnServiceNon:
                break;

            /* Patient View */
            case R.id.btnRequest:
                iHomePresenter.displayRequest();
                break;
            case R.id.btnTracking:
                iHomePresenter.displayTracking();
                break;
            case R.id.btnSetting:
                iHomePresenter.displaySetting();
                break;
            case R.id.btnService:
                break;

            /* Both View */
            case R.id.btnFAQ:
                iHomePresenter.displayFAQs("FAQs");
                break;
            case R.id.btnUrgentCare:
                iHomePresenter.displayFAQs("UR");
                break;
            case R.id.btnContact:
                contactCentral();
                break;
            default:
                break;
        }
    }

    private void contactCentral() {
        Uri call = Uri.parse("tel:" + getResources().getString(R.string.phone_call));
        Intent phoneCallIntent = new Intent(Intent.ACTION_CALL, call);
        startActivity(phoneCallIntent);
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
    public void changeView(boolean result) {
        if (result){
            iHomePresenter.getInfoPatient();
            btnLogin.setVisibility(View.GONE);
            vfHome.setDisplayedChild(vfHome.indexOfChild(layoutPatient));
        }
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
    }
}
