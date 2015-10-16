package com.redimed.telehealth.patient.fragment;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.redimed.telehealth.patient.R;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class FAQsFragment extends Fragment {

    private View v;

    @Bind(R.id.webFAQs)
    WebView webViewFAQs;

    public FAQsFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        v = inflater.inflate(R.layout.fragment_faqs, container, false);
        ButterKnife.bind(this, v);
        String url = "file:///android_asset/FAQs.html";
        WebSettings webSettings = webViewFAQs.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webViewFAQs.loadUrl(url);
        return v;
    }


}
