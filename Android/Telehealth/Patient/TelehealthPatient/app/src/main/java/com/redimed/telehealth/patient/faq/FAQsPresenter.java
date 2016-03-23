package com.redimed.telehealth.patient.faq;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;

import com.redimed.telehealth.patient.confirm.ConfirmFragment;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;

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
        Log.d(TAG, backupConfirm + " " + bundle);
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
                    break;
            }
        }
        ifaqsView.onViewPage(url);
    }

    @Override
    public void backToHome(Boolean flag) {
        IMainPresenter iMainPresenter = new MainPresenter(context, activity);
        if (flag) {
            Fragment fragment = new ConfirmFragment();
            fragment.setArguments(backupConfirm.getBundle("dataConfirm"));
            iMainPresenter.replaceFragment(fragment);
        } else
            iMainPresenter.replaceFragment(new HomeFragment());
    }
}
