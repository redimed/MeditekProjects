package com.redimed.telehealth.patient.faq.presenter;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import com.redimed.telehealth.patient.faq.view.IFAQsView;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.request.RequestFragment;

/**
 * Created by Fox on 1/14/2016.
 */
public class FAQsPresenter implements IFAQsPresenter {

    private Context context;
    private IFAQsView ifaqsView;
    private Bundle backupConfirm;
    private FragmentActivity activity;
    private static final String TAG = "=====FAQs=====";

    public FAQsPresenter(IFAQsView ifaqsView, Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.ifaqsView = ifaqsView;
    }

    @Override
    public void contentFAQs(Bundle bundle) {
        backupConfirm = bundle;
        String url = "file:///android_asset/FAQs.html";
        if (bundle != null) {
            String page = bundle.getString("msg");
            assert page != null;
            switch (page) {
                case "UR":
                    url = "file:///android_asset/AboutUs.html";
                    break;
                case "FAQs":
                    url = "file:///android_asset/FAQs.html";
                    break;
                case "Service":
                    url = "file:///android_asset/Other.html";
                    break;
                case "ConfirmFAQs":
                    url = "file:///android_asset/FAQs.html";
                    break;
                default:
                    url = "file:///android_asset/FAQs.html";
                    break;
            }
        }
        ifaqsView.onViewPage(url);
    }

    @Override
    public void backToHome(Boolean flag) {
        IMainPresenter iMainPresenter = new MainPresenter(context, activity);
        if (flag) {
            Fragment fragment = new RequestFragment();
            fragment.setArguments(backupConfirm.getBundle("dataConfirm"));
            iMainPresenter.replaceFragment(fragment);
        } else
            iMainPresenter.replaceFragment(new HomeFragment());
    }
}
