package com.redimed.telehealth.patient.faq;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;

import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;

/**
 * Created by Fox on 1/14/2016.
 */
public class FAQsPresenter implements IFAQsPresenter {

    private Context context;
    private IFAQsView ifaqsView;

    public FAQsPresenter(IFAQsView ifaqsView, Context context) {
        this.context = context;
        this.ifaqsView = ifaqsView;
    }

    @Override
    public void contentFAQs(Bundle bundle) {
        String url = "file:///android_asset/FAQs.html";
        if (bundle != null) {
            String page = bundle.getString("msg");
            assert page != null;
            switch (page){
                case "UR":
                    url = "file:///android_asset/AboutUs.html";
                    break;
                case "FAQs":
                    url = "file:///android_asset/FAQs.html";
                    break;
                case "Service":
                    url = "file:///android_asset/UrgentCare.html";
                    break;
                default:
                    break;
            }
        }
        ifaqsView.onViewPage(url);
    }

    @Override
    public void backToHome(FragmentActivity activity) {
        IMainPresenter iMainPresenter = new MainPresenter(context, activity);
        iMainPresenter.replaceFragment(new HomeFragment());
    }
}
