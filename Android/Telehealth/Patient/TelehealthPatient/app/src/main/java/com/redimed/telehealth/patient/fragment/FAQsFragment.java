package com.redimed.telehealth.patient.fragment;


import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class FAQsFragment extends Fragment {

    private View v;
    private String TAG = "FAQs";

    @Bind(R.id.webFAQs)
    WebView webViewFAQs;

    public FAQsFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        v = inflater.inflate(R.layout.fragment_faqs, container, false);
        ButterKnife.bind(this, v);
        String url = "file:///android_asset/FAQs.html";
        WebSettings webSettings = webViewFAQs.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webViewFAQs.setBackgroundColor(Color.TRANSPARENT);
        webViewFAQs.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
        webViewFAQs.loadUrl(url);
        return v;
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK){
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
